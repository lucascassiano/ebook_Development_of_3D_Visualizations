console.log("Basic Example - loading object");

var camera, scene, renderer;
var width = 600;//window.innerWidth;  //= 600;
var height = 400;//window.innerHeight; // = 400;
var loadedObj;
var rotation = 0;
var group;
var cube;
var mouseX = 0, mouseY = 0;
var windowHalfX = width / 2;
var windowHalfY = height / 2;

var controls;
var raycaster;
var INTERSECTED;
var mouse = new THREE.Vector2();
console.log("data", data);
init();
animate();

function init() {
    camera = new THREE.PerspectiveCamera(70, width / height, 1, 1000);
    camera.position.z = 12;
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    var ambient = new THREE.AmbientLight(0x444444);
    scene.add(ambient);

    var directionalLight = new THREE.DirectionalLight(0xffeedd);
    directionalLight.position.set(0, 0, 1).normalize();
    scene.add(directionalLight);

    group = new THREE.Object3D();

    //Loading Obj-----------------------------
    var onError = function (xhr) { };
    var onProgress = function (xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };

    //Carregando Material
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('models/');
    mtlLoader.load('heart.mtl', function (materials) {
        materials.preload();
        //Quando o material for carregado, carregamos a geometria (.obj)
        var objLoader = new THREE.OBJLoader();

        objLoader.setMaterials(materials);
        objLoader.setPath('models/');
        objLoader.load('heart.obj', function (object) {
            //loadedObj = object.clone();
            loadedObj = object;
            loadedObj.position.y = -3;
            console.log("loadedObj",loadedObj);

            //scene.add(loadedObj); //Adicionando o objeto a cena
            group.add(loadedObj);

        }, onProgress, onError);

    });
    //--------------------------------------------

    var material = new THREE.MeshBasicMaterial({ color: 0xBD10E0, wireframe: true, opacity: 0.2, transparent: true });
    var geometry = new THREE.BoxGeometry(6, 6, 6);
    cube = new THREE.Mesh(geometry, material);
    cube.position.y = 1.5;
    group.add(cube);
    //loadedObj.add( cube );


    //Shadow
    var shadowtexture = new THREE.TextureLoader().load("tex/shadow.png");
    shadowtexture.wrapS = THREE.ClampToEdgeWrapping;
    shadowtexture.wrapT = THREE.ClampToEdgeWrapping;

    var shadowMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, map: shadowtexture, transparent: true, opacity: 0.25 });
    var shadowGeometry = new THREE.PlaneGeometry(5, 5, 1);
    var shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
    shadow.position.y = -3;
    shadow.rotation.x = -Math.PI * 0.5;
    group.add(shadow);

    //Circle
    var circletexture = new THREE.TextureLoader().load("tex/circle.png");
    circletexture.wrapS = THREE.ClampToEdgeWrapping;
    circletexture.wrapT = THREE.ClampToEdgeWrapping;
    //shadowtexture.repeat.set( 1, 1 );

    var circleMaterial = new THREE.MeshBasicMaterial({ map: circletexture, transparent: true, opacity: 0.5, alphaTest: 0.0, depthWrite: false });
    var circleGeometry = new THREE.PlaneGeometry(12, 12, 1);
    var circle = new THREE.Mesh(circleGeometry, circleMaterial);
    circle.position.y = -2;
    circle.rotation.x = -Math.PI * 0.5;
    group.add(circle);

    scene.add(group);

    raycaster = new THREE.Raycaster();

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);

    renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);

    //--Orbit controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render); // remove when using animation loop
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    console.log("scene.children", scene.children);

    var size = 10;
    var divisions = 10;
    
    var gridHelper = new THREE.GridHelper( size, divisions );

}

function render() {
    // find intersections
    //camera.updateMatrixWorld();

    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(loadedObj.children);
    
    if (intersects.length > 0) {
        //console.log("intersected", intersects);

        if (INTERSECTED != intersects[0].object) {
            if (INTERSECTED)
                INTERSECTED.material.color.setHex(INTERSECTED.currentHex);

            INTERSECTED = intersects[0].object;
            INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
            INTERSECTED.material.color.setHex(0x00FF00);
            
        }

    } else {
        if (INTERSECTED){
            INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
        } 
        INTERSECTED = null;
    }

    renderer.render(scene, camera);
}

//console.log("Selected", INTERSECTED);

console.log("Previous selection", INTERSECTED);
function ShowHideCube() {
    cube.visible = !cube.visible;
}

//keyboard arrows
document.onkeydown = checkKey;

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '37') {
        // left arrow
        rotation -= 0.1;
    }
    else if (e.keyCode == '39') {
        // right arrow
        rotation += 0.1;
    }

}

function onDocumentMouseMove(event) {
    var rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ( ( event.clientX - rect.left ) / rect.width ) * 2 - 1;
    mouse.y = - ( ( event.clientY - rect.top ) / rect.height ) * 2 + 1;
}

function animate() {
    setTimeout(function () {

        requestAnimationFrame(animate);

    }, 1000 / 30); //forcing 30FPS

    controls.update();
    render();
}


