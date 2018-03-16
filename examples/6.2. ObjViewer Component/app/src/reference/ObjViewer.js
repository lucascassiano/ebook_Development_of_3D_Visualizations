import React from 'react';
import ReactDOM from 'react-dom';

import * as THREE from 'three';
import ExampleBase from './ExampleBase';

import React3 from 'react-three-renderer';

var OrbitControls = require('three-orbit-controls')(THREE)

const perspectiveCameraName = 'perspectiveCamera';
const orthographicCameraName = 'orthographicCamera';
const mainCameraName = 'mainCamera';

const perspectiveCameraRotation = new THREE.Euler(Math.PI / 2, Math.PI, 0);
const orthographicCameraRotation = new THREE.Euler(-Math.PI / 2, 0, 0);
const orthographicCameraPosition = new THREE.Vector3(0, 500, 0);

const spherePosition = new THREE.Vector3(20, 200, 0);
import Stats from 'stats.js';

import './3d/OBJLoader.js';
import './3d/MTLLoader.js';

const d = 40;

import sizeMe from 'react-sizeme';
var controls;
import MouseInput from './3d/MouseInput';
class ObjViewer extends React.Component {
  constructor(props, context) {
    super(props, context);
    //const r = Date.now() * 0.0005;
    this.state = {
      activeCameraName: perspectiveCameraName,
      paused: false,
      mainCameraPosition: new THREE.Vector3(500, 500, 500),
      showStats: false,
      cameraMode: "Perspective"
    };

    this.lightPosition = new THREE.Vector3(50, 600, 50);
    this.lightTarget = new THREE.Vector3(0, 0, 0);

    this.Setup = this.Setup.bind(this);
    this.Update = this.Update.bind(this);
    this.AddObject = this.AddObject.bind(this);

    this.changeCamera = this.changeCamera.bind(this);
  }

  LoadObj() {
    const PATH = "http://localhost:3000/obj/";
    const modelName = this.props.objName;
    const MTL_FILE = modelName + ".mtl";
    const OBJ_FILE = modelName + ".obj";

    var onProgress = function (xhr) {
      if (xhr.lengthComputable) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log(Math.round(percentComplete, 2) + '% downloaded');

      }
    };
    var onError = function (xhr) {
      console.log("error", xhr)
    };

    // OBJ Loader
    const objLoader = new THREE.OBJLoader();
    var meshMaterial = new THREE.MeshBasicMaterial({ color: 0x7777ff });
    //objLoader.setMaterials(meshMaterial);
    const mtlLoader = new THREE.MTLLoader();
    mtlLoader.setBaseUrl(PATH);
    mtlLoader.setPath(PATH); // One of these might not be needed
    mtlLoader.crossOrigin = '*'; // Use as needed
    mtlLoader.load(MTL_FILE, materials => {
      objLoader.setMaterials(materials);
      objLoader.setPath(PATH);
      objLoader.load(OBJ_FILE, object => {
        for (let child of object.children) {

          if (this.props.mainColor) {
            var newMaterial = new THREE.MeshBasicMaterial(child.material);
            newMaterial.blending = THREE.AdditiveBlending;
            //newMaterial.depthTest = false;
            newMaterial.color = this.props.mainColor;
            newMaterial.transparent = true;
            child.material = newMaterial;
          }
          child.material.side = THREE.DoubleSide;
          //child.blending = THREE.AdditiveBlending;
          //child.material.depthTest = false;
          child.material.depthWrite = false;
          child.material.transparent = true;
          if (this.props.wireframe) {
            child.material.wireframe = true;
          }
          child.castShadow = true;
          child.receiveShadow = true;
        }
        this.refs.group.add(object);
        //console.log("Object", object);

      }, onProgress, onError);

    });
  }

  componentDidMount() {
    document.addEventListener('keydown', this._onKeyDown, false);
    //window.addEventListener('resize', this._onResize);
    var container = ReactDOM.findDOMNode(this.refs.container);
    this.setState({ container: container });
    this.setState({ width: this.props.width, height: this.props.height });
    var aspectRatio = this.props.width / this.props.height;
    this.setState({ aspectRatio: aspectRatio });
    controls = new OrbitControls(this.refs.camera, ReactDOM.findDOMNode(this.refs.react3));
    controls.enableZoom = true;
    if(this.props.disableZoom)
      controls.enableZoom = false;
    controls.minPolarAngle = 0; // radians
    controls.maxPolarAngle = Math.PI * 2; // radians
    this.controls = controls;

    //Add Stats
    if (this.props.showStats) {
      this.stats = new Stats();
      var top = container.getBoundingClientRect().top;
      this.stats.domElement.style.position = 'absolute';
      this.stats.domElement.style.top = '0px';
      var statsContainer = ReactDOM.findDOMNode(this.refs.react3);

      container.appendChild(this.stats.domElement);
    }

    this.LoadObj();

    //Setup zoom
    if (this.props.distance)
      this.setState({ mainCameraPosition: new THREE.Vector3(this.props.distance, this.props.distance, this.props.distance) })


    this.Setup();
    this.setState({ groupRef: this.refs.group });
    var extra = (
      <mesh>
        <boxGeometry
          width={100}
          height={100}
          depth={100}
          widthSegments={4}
          heightSegments={4}
          depthSegments={4}
        />
        <meshBasicMaterial
          color={0x0000FF}
        />
      </mesh>
    )

    //this.setState({ extra: extra });
  }


  componentWillUnmount() {
    document.removeEventListener('keydown', this._onKeyDown, false);
    //window.removeEventListener('resize', this._onResize);
    this.controls.dispose();
    delete this.controls;
    delete this.stats;
  }

  _onKeyDown = (event) => {
    switch (event.keyCode) {
      default:
        break;
      case 79: // O
        this.setState({
          activeCameraName: orthographicCameraName,
        });
        break;
      case 80: // P
        this.setState({
          activeCameraName: perspectiveCameraName,
        });

        break;
    }
  };

  Update = () => {

  }

  Setup = function () {

  }

  AddObject(mesh) {
    var group = new THREE.Object3D();//create an empty container
    group.add(mesh);
    this.refs.group.add(group);
  }


  _onAnimate = () => {
    if (this.state.paused) {
      return;
    }
    this.props.update();
    if (this.props.showStats) {
      this.stats.update();
    }

  };

  changeCamera() {
    if (this.state.activeCameraName == orthographicCameraName) {
      this.setState({ activeCameraName: perspectiveCameraName });
      this.setState({ cameraMode: "Perspective" });
      controls.enabled = true;
      controls.enableRotate = true;

    }
    else {
      this.setState({ activeCameraName: orthographicCameraName });
      this.setState({ cameraMode: "Top" });
      controls.enabled = false;
      controls.enableRotate = false;
    }

  }


  render() {

    /*
    canvas.width  = canvas.clientWidth;
canvas.height = canvas.clientHeight;
    */
    const {
      width,
      height,
    } = this.props.size;

    const {
      meshPosition,
      childPosition,
      r,
      activeCameraName,
      cameraMode
      } = this.state;


    return (
      <div className="objViewer" ref="container">

        <React3
          ref="react3"
          width={width}
          height={height}
          antialias
          onAnimate={this._onAnimate}
          mainCamera={activeCameraName}
          alpha={true}
        >

          <scene>
            <perspectiveCamera
              ref="camera"
              name={perspectiveCameraName}
              fov={30}
              aspect={width / height}
              near={1}
              far={10000}
              position={this.state.mainCameraPosition} />
            <ambientLight
              color={0xFFFFFF}
            />

            <orthographicCamera
              name={orthographicCameraName}
              left={0.5 * width * -1}
              right={0.5 * width}
              top={height / 2}
              bottom={height / -2}
              near={0}
              far={100}
              rotation={orthographicCameraRotation}
              position={orthographicCameraPosition}
            />

            <pointLight
              color={0x000000}
              position={this.spherePosition}

            />

            <group ref='group' />

            <group ref='objects'>
              {this.props.objects}
            </group>
          </scene>
        </React3>


      </div>);
  }
}



export default sizeMe({ monitorHeight: true, refreshRate: 200 })(ObjViewer);