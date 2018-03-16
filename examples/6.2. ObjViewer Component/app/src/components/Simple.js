import React from 'react';
import React3 from 'react-three-renderer';
import * as THREE from 'three';
import ReactDOM from 'react-dom';

import sizeMe from 'react-sizeme';
import Stats from 'stats.js';

var OrbitControls = require('three-orbit-controls')(THREE)
var controls;
var mouse = new THREE.Vector2();
1
class Simple extends React.Component {
    constructor(props, context) {
        super(props, context);

        // construct the position vector here, because if we use 'new' within render,
        // React will think that things have changed when they have not.
        this.cameraPosition = new THREE.Vector3(0, 0, 5);

        this.state = {
            cubeRotation: new THREE.Euler(),
        };

        this._onAnimate = () => {
            // we will get this callback every frame

            // pretend cubeRotation is immutable.
            // this helps with updates and pure rendering.
            // React will be sure that the rotation has now updated.
            this.setState({
                cubeRotation: new THREE.Euler(
                    this.state.cubeRotation.x + 0.1,
                    this.state.cubeRotation.y + 0.1,
                    0
                ),
            });
        };
    }

    componentDidMount() {
        let scene = this.refs.scene;
        scene.background = new THREE.Color(0xffffff);

        var circleMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000, transparent: true, opacity: 0.5, alphaTest: 0.0, depthWrite: false });
        var circleGeometry = new THREE.PlaneGeometry(12, 12, 1);
        var circle = new THREE.Mesh(circleGeometry, circleMaterial);
        circle.position.y = -2;
        circle.rotation.x = -Math.PI * 0.5;
        scene.add(circle);

        controls = new OrbitControls(this.refs.camera, ReactDOM.findDOMNode(this.refs.renderer));
        controls.enableZoom = true;

        controls.enablePan = false;
        controls.minPolarAngle = 0; // radians
        controls.maxPolarAngle = Math.PI * 2; // radians
        //this.controls = controls;
        //controls.enabled = true;
        //this.refs.renderer.addEventListener('mousemove', this.onDocumentMouseMove, false);

    }

    _onMouseMove(event) {
        //if (this.refs.renderer) {
            var rect = ReactDOM.findDOMNode(this.refs.renderer).getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = - ((event.clientY - rect.top) / rect.height) * 2 + 1;
            console.log("mouse", mouse);
        //}
    }


    render() {
        var width, height;
        if (this.props.width && this.props.height) {
            width = this.props.width;//window.innerWidth; // canvas width
            height = this.props.height;//window.innerHeight; // canvas height
        } else {
            width = window.innerWidth; // canvas width
            height = window.innerHeight; // canvas height
        }

        return (<React3
            mainCamera="camera" // this points to the perspectiveCamera which has the name set to "camera" below
            width={width}
            height={height}
            ref="renderer"
            onAnimate={this._onAnimate}
            antialias
            onMouseMove={this._onMouseMove}
            alpha={true}
        >
            <scene
                ref="scene"
            >
                <perspectiveCamera
                    name="camera"
                    ref="camera"
                    fov={75}
                    aspect={width / height}
                    near={0.1}
                    far={1000}

                    position={this.cameraPosition}
                />
                <mesh
                    rotation={this.state.cubeRotation}
                >
                    <boxGeometry
                        width={1}
                        height={1}
                        depth={1}
                    />
                    <meshBasicMaterial
                        color={0x000000}
                        wireframe
                    />
                </mesh>
            </scene>
        </React3>);
    }
}

export default Simple;
//ReactDOM.render(<Simple/>, document.body);