import React, { Component } from 'react';
import * as THREE from 'three';

import OBJLoader from "three-react-obj-loader";
import MTLLoader from 'three-react-mtl-loader';

var renderer, scene, camera, mainObject;

class ObjViewer extends Component {

  constructor(props) {
    super(props);   
  }

  componentDidMount() {
    var { objPath, mtlPath, width, height, obj } = this.props;

    if (obj) {
      objPath = obj + ".obj";
      mtlPath = obj + ".mtl";
    }

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);

    renderer = new THREE.WebGLRenderer({ canvas: this.refs.threeCanvas, alpha: true, antialias: true });
    renderer.setSize(width, height);

    camera.position.z = 10;

    var mtlLoader = new MTLLoader();
    mtlLoader.load(mtlPath, function (materials) {

      materials.preload();

      var objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.load(objPath, function (object) {
        mainObject = object;
        mainObject.position.y = -5;
        scene.add(mainObject);
        //this._addObject(mainObject);
      });

    });

    //luzes
    var light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    this._render();
  }

  _render = () => {

    requestAnimationFrame(this._render);
    renderer.render(scene, camera);

    if (mainObject)
      mainObject.rotation.y += 0.01;

  }

  render() {
    return (
      <div>
        <canvas ref="threeCanvas">
        </canvas>
      </div>
    );
  }
}

export default ObjViewer;

/*
use it like this:
<ObjViewer 
		objFile=“./models/file.obj” 
		mtlFile=“./models/file.mtl”
		width={800}
		height={600}
  />
  */