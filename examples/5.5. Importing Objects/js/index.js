console.log("Basic Example - loading object");

var camera, scene, renderer;
var width = 600;
var height = 300;
var singleObj;

init();
animate();

function init() {
    camera = new THREE.PerspectiveCamera(70, width / height, 1, 1000);
    camera.position.z = 10;
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    var ambient = new THREE.AmbientLight(0x444444);
    scene.add(ambient);

    var directionalLight = new THREE.DirectionalLight(0xffeedd);
    directionalLight.position.set(0, 0, 1).normalize();
    scene.add(directionalLight);


    //Loading Obj-----------------------------
    var onError = function (xhr) { };
    //THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());
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
            object.position.y = - 3; //<-- Ponto aonde podemos fazer alteracoes no objeto
            singleObj = object.clone();
            scene.add(singleObj); //Adicionando o objeto a cena
            renderer.render(scene, camera);
        }, onProgress, onError);
    
    });
    //--------------------------------------------

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);

    renderer.render(scene, camera);
}

var a=0;

function animate() {
    requestAnimationFrame(animate);
    a+=0.1;

    singleObj.rotation.y+=0.01;

    renderer.render(scene, camera);
}
