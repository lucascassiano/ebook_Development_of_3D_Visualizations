import React, { Component } from 'react';
import * as THREE from 'three';
let renderer, scene, camera, mainObject;

class ObjViewer extends Component {
  constructor(props) {
    super(props);
    //Do something interesting here
  }

  componentDidMount() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, 500 / 400, 0.1, 1000);

    renderer = new THREE.WebGLRenderer({ canvas: this.refs.threeCanvas, alpha: true });
    renderer.setSize(500, 400);

    var wireframe = false;

    //alterando a cor do material 
    var material = new THREE.MeshBasicMaterial({ color: this.props.objectColor, wireframe: wireframe, transparent: true, opacity: 0.4 });
    var geometry;

    geometry = new THREE.SphereGeometry(3, 24, 24);

    mainObject = new THREE.Mesh(geometry, material);
    scene.add(mainObject);
    camera.position.z = 10;


    this._render();
  }

  _render = () => {

    requestAnimationFrame(this._render);
    renderer.render(scene, camera);
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
