import React, { Component } from 'react';
import * as THREE from 'three';
let renderer, scene, camera, mainObject;

class Container3 extends Component {
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
    if (this.props.wireframe)
      wireframe = true;

    //alterando a cor do material 
    var material = new THREE.MeshBasicMaterial({ color: this.props.objectColor, wireframe: wireframe, transparent: true, opacity: 0.4 });
    var geometry;

    //checando o tipo de geometria a ser renderizado
    if (this.props.object == "sphere") {
      geometry = new THREE.SphereGeometry(3, 24, 24);
    }

    else if(this.props.object == "cube"){
      geometry = new THREE.BoxGeometry(3,3,3);
    }

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

export default Container3;
