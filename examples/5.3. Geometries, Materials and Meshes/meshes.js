console.log("Meshes");

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

    var material = new THREE.MeshPhongMaterial( {color: "#0099cc", wireframe:false} );
    
    var geometry = new THREE.PlaneGeometry( 100, 100, 1 );

    var plane = new THREE.Mesh( geometry, material );
    plane.position.x = -300;
    plane.rotation.x = 0.5;
    plane.rotation.y = 0.5;
    scene.add( plane );

    var geometry = new THREE.BoxGeometry( 100, 100, 100 );
    var cube = new THREE.Mesh( geometry, material );
    cube.rotation.x=0.5;
    cube.rotation.y=0.5;
    cube.position.x = -150;
    scene.add( cube );


    var geometry = new THREE.SphereGeometry( 50, 12, 12 );
    var sphere = new THREE.Mesh( geometry, material );
    sphere.rotation.x = 0.5;
    sphere.rotation.y = 0.5;
    sphere.position.x = 0;
    scene.add( sphere );

    var geometry = new THREE.ConeGeometry( 50, 100, 12 );
    var cone = new THREE.Mesh( geometry, material );
    cone.rotation.x=0.5;
    cone.rotation.y=0.5;
    cone.position.x=150;
    scene.add( cone );

    var geometry = new THREE.CylinderGeometry( 50, 50, 100, 12 );
    var cylinder = new THREE.Mesh( geometry, material );
    cylinder.rotation.x=0.5;
    cylinder.rotation.y=0.5;
    cylinder.position.x=300;
    scene.add( cylinder );


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
