import React, { Component } from 'react';
import React3 from 'react-three-renderer';
import * as THREE from 'three';

class RendererViewer extends Component {
  constructor(props) {
    super(props);

    this.cameraPosition = new THREE.Vector3(0, 0, 5);
    
  }

  

  render() {
    const width = window.innerWidth; // canvas width
    const height = window.innerHeight; // canvas height

    return (
      <React3
        mainCamera="camera" // this points to the perspectiveCamera which has the name set to "camera" below
        width={width}
        height={height}
      >

        <scene>
          <perspectiveCamera
            name="camera"
            fov={75}
            aspect={width / height}
            near={0.1}
            far={1000}
            position={this.cameraPosition}
          />
          <mesh>
            <boxGeometry
              width={1}
              height={1}
              depth={1}
            />
            <meshBasicMaterial
              color={0x00ff00}
            />
          </mesh>
        </scene>
      </React3>);

  }
}

export default RendererViewer;
