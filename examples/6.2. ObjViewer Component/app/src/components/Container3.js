import React, { Component } from 'react';
import * as THREE from 'three';
let renderer, scene, camera, mainSphere;

class Container3 extends Component {
  constructor(props) {
    super(props);
    //Do something interesting here
  }

  componentDidMount() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, 500 / 400, 0.1, 1000);

    renderer = new THREE.WebGLRenderer({ canvas: this.refs.threeCanvas, alpha:true });
    renderer.setSize(500, 400);

    var geometry = new THREE.SphereGeometry(3, 24, 24);
    var material = new THREE.MeshBasicMaterial({color:0x00aaff, wireframe:true, transparent:true, opacity:0.4});
    mainSphere = new THREE.Mesh(geometry,material);

    scene.add(mainSphere);
    camera.position.z = 10;


    this._render();
  }
  
  _render=()=>{

      requestAnimationFrame(this._render);
      renderer.render(scene, camera);
      mainSphere.rotation.y+=0.01;
  
  }

  render() {
    return (
      <div className="App">
        <canvas ref="threeCanvas">
        </canvas>
      </div>
    );
  }
}

export default Container3;
