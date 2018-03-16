console.log("Basic Example - loading object");

var camera, scene, renderer;
var width = 600;
var height = 400;
var loadedObj;
var rotation = 0;
var group;
var cube;
var mouseX = 0, mouseY = 0;
var windowHalfX = width / 2;
var windowHalfY = height / 2;


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

    /*
    group = new THREE.Object3D();//create an empty container
    group.add( mesh );//add a mesh with geometry to it
    scene.add( group );//when done, add the group to the scene
    */
    scene.add(group);
    renderer = new THREE.WebGLRenderer();
    //renderer.context.disable(renderer.context.DEPTH_TEST)
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);

    //renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );

    renderer.domElement.addEventListener("mousedown", function (e) {
        onMouseMove(e);
        this.addEventListener("mousemove", onMouseMove);
    });

    renderer.domElement.addEventListener("mouseup", function (e) {
        this.removeEventListener("mousemove", onMouseMove);
    });

}



//Html buttons
function RotationLeft() {
    rotation -= 0.1;
}

function RotationRight() {
    rotation += 0.1;
}

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


//Mouse function
function onMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) / 2;
    mouseY = (event.clientY - windowHalfY) / 2;
}


function animate() {
    setTimeout(function () {

        requestAnimationFrame(animate);

    }, 1000 / 30);

    // renderer.render();

    //loadedObj.rotation.y = rotation;

    group.rotation.y = rotation;
    
    //automaticRotation
    var checkbox = document.getElementById('automatic-rotation').checked;
    if (checkbox)
        rotation += 0.01;


    renderer.render(scene, camera);
}


