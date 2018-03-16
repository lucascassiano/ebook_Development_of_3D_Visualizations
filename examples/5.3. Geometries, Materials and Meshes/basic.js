console.log("Basic Example");

var camera, scene, renderer;
var width=600;
var height=300;

init();
animate();

function init() {
    camera = new THREE.PerspectiveCamera(70, width/height, 1, 1000);
    camera.position.z = 300;
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width,height);
    document.body.appendChild(renderer.domElement);
}


function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
