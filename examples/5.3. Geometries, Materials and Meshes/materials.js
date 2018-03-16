console.log("Materials");
//https://threejs.org/docs/#api/materials/

var camera, scene, renderer;
var width=600;
var height=300;

init();
animate();

function init() {
    camera = new THREE.PerspectiveCamera(70, width/height, 1, 1000);
    camera.position.z = 300;
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    var geometry = new THREE.SphereGeometry(50, 200, 200);
    var material = new THREE.MeshNormalMaterial();

    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.x -= 225;
    scene.add(mesh);

    var material1 = new THREE.MeshBasicMaterial({ color: "#0099cc" });
    var mesh1 = new THREE.Mesh(geometry, material1);
    mesh1.position.x -= 75;
    scene.add(mesh1);

    var material2 = new THREE.MeshLambertMaterial({ color: "#0099cc" });
    var mesh2 = new THREE.Mesh(geometry, material2);
    mesh2.position.x += 75;
    scene.add(mesh2);

    var material3 = new THREE.MeshPhongMaterial({ color: "#0099cc" });
    var mesh3 = new THREE.Mesh(geometry, material3);
    mesh3.position.x += 225;
    scene.add(mesh3);

    //luzes
    var light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width,height);
    document.body.appendChild(renderer.domElement);

}


function animate() {
    //requestAnimationFrame(animate);
    //mesh.rotation.x += 0.005;
    //mesh.rotation.y += 0.01;
    renderer.render(scene, camera);
}
