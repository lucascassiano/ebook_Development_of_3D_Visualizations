console.log("Basic Example - loading multiple objects");

var camera, scene, renderer;
var width = 600;
var height = 300;
var mainObj;

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
        console.log("Materials do mtl" , materials.materials.material1);
        //materials.materials.material1.color=0x00ff00;
        materials.materials.material1 = new THREE.MeshPhongMaterial( {color: "#00FF00", wireframe:true});
        
        //materials[0].color = "#00FF00";
        objLoader.setMaterials(materials);
        objLoader.setPath('models/');
        objLoader.load('heart.obj', function (object) {
            object.position.y = - 2; //<-- Ponto aonde podemos fazer alteracoes no objeto
            mainObj = object;
            scene.add(object); //Adicionando o objeto a cena

            var obj2 = object.clone();
            obj2.position.x = -8;
            obj2.rotation.y = 0.8;
            scene.add(obj2);

            var obj3 = object.clone();
            obj3.position.x = 8;
            obj3.rotation.y = -0.5;
            obj3.scale.set(0.5,0.5,0.5);
            scene.add(obj3);

        }, onProgress, onError);
    
    });
    //--------------------------------------------

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);
}

var a = 0;

function animate() {
    requestAnimationFrame(animate);
    mainObj.rotation.y+=0.05;
    //camera.position.x =  5*Math.sin(a);
    //a+=0.005;
    //camera.lookAt(scene.position);

    renderer.render(scene, camera);
    //renderer.deallocateObject( mainObj );
}
