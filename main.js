import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@0.139.2/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.139.2/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'https://unpkg.com/three@0.139.2/examples/jsm/loaders/DRACOLoader.js';
import { RGBELoader } from 'https://unpkg.com/three@0.136.0/examples/jsm/loaders/RGBELoader.js';

// Global variables
let renderer, scene, camera, controls, model, mixer, width, height, sceneContainer;

let forward, backward, right, left, space, down = false
let movKey = false;
let walkingAction, idleAction;
let moveSpeed = 0.025;
const clock = new THREE.Clock();

sceneContainer = document.getElementById('screen');
width = sceneContainer.clientWidth;
height = sceneContainer.clientHeight;

// RENDERER
function createRenderer() {
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 3;
    renderer.shadowMap.enabled = true;
    renderer.setAnimationLoop(render);
    sceneContainer.appendChild(renderer.domElement);

    function render() {
        renderer.render(scene, camera);
    }
}

// CAMERA
function createCamera() {
    const FOV = 50;
    const aspect = width / height;
    const near = 0.5;
    const far = 1000;

    camera = new THREE.PerspectiveCamera(FOV, aspect, near, far);
    camera.position.set(0, 5, 10);

    controls = new OrbitControls(camera, renderer.domElement);
}

// MODELS
function addModel(scene) {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    loader.load("./models/nahome101.glb", function (gltf) {
        model = gltf.scene;
        model.position.set(0, 0, 0);
        model.scale.set(0.75, 0.75, 0.75);
        model.castShadow = true;

        mixer = new THREE.AnimationMixer(model);
        walkingAction = mixer.clipAction(gltf.animations[0]);
        idleAction = mixer.clipAction(gltf.animations[1]);
        const flyingAction = mixer.clipAction(gltf.animations[2]);
        const jumpAction = mixer.clipAction(gltf.animations[3]);
        const landAction = mixer.clipAction(gltf.animations[4]);
        const shootAction = mixer.clipAction(gltf.animations[5]);

        idleAction.play();
        walkingAction.play();
        flyingAction.play();
        jumpAction.play();
        landAction.play();
        shootAction.play();

        idleAction.enabled = true;
        walkingAction.enabled = false;
        flyingAction.enabled = false;
        jumpAction.enabled = false;
        landAction.enabled = false;
        shootAction.enabled = false;

        scene.add(model);
    })

    loader.load("./models/land.glb", function (gltf) {
        const root = gltf.scene;
        root.castShadow = true;

        const screen01 = root.getObjectByName('')
        scene.add(root);
    });

    loader.load("./models/creativeCloud.glb", function (gltf) {
        const root = gltf.scene;

        mixer = new THREE.AnimationMixer(root);
        const rotateFloat = mixer.clipAction(gltf.animations[0]);

        rotateFloat.play();
        rotateFloat.enabled = true;

        scene.add(root);
    });

    loader.load("./models/creativeCloudAppsRotate.glb", function (gltf) {
        const root = gltf.scene;
        root.castShadow = true;
        scene.add(root);

        mixer = new THREE.AnimationMixer(root);
        const rotateFloat = mixer.clipAction(gltf.animations[0]);

        rotateFloat.play();
        rotateFloat.enabled = true;

        scene.add(root);
    });

    loader.load("./models/githubOctoCat.glb", function (gltf) {
        const root = gltf.scene;
        root.castShadow = true;

        const mixer = new THREE.AnimationMixer( root );
        const clips = gltf.animations;
        
        const clip = THREE.AnimationClip.findByName( clips, 'catRotate' );

        const action = mixer.clipAction( clip );
        action.play();
        
        clips.forEach( function ( clip ) {
            mixer.clipAction( clip ).play();
        } );

        scene.add(root);

    });

    loader.load("./models/vsLanguagesRotate.glb", function (gltf) {
        const root = gltf.scene;
        root.castShadow = true;
        scene.add(root);

        mixer = new THREE.AnimationMixer(root);
        const rotateFloat = mixer.clipAction(gltf.animations[0]);

        rotateFloat.play();
        rotateFloat.enabled = true;

        scene.add(root);
    });

    loader.load("./models/visualStudioIcon.glb", function (gltf) {
        const root = gltf.scene;
        root.castShadow = true;
        scene.add(root);

        mixer = new THREE.AnimationMixer(root);
        const rotateFloat = mixer.clipAction(gltf.animations[0]);

        rotateFloat.play();
        rotateFloat.enabled = true;

        scene.add(root);
    });
}

// LIGHTS
function addLights(scene) {
    const sun = new THREE.HemisphereLight(0xffffff, 0x000000);
    sun.position.set(18.875, 21.612, 0);
    sun.intensity = 1;
    sun.castShadow = true;

    const bedroomLight = new THREE.PointLight(0xffffff);
    bedroomLight.position.set(-0.624, 1.801, 0.366);
    bedroomLight.intensity = 2.22;
    bedroomLight.distance = 3.08;
    bedroomLight.castShadow = true;

    scene.add(sun, bedroomLight);
}

// ANIMATE
function animate() {
    requestAnimationFrame(animate);
    mixer.update(clock.getDelta());
    controls.update();
    renderer.render(scene, camera);
}

export function init() {
    scene = new THREE.Scene();
    var loader = new THREE.TextureLoader();
    var texture = loader.load('./textures/trees.svg');
    scene.background = new THREE.MeshBasicMaterial({map: texture});
    scene.fog = new THREE.Fog(0x6c9696, 90, 100);


    createRenderer();
    createCamera();
    addModel(scene);
    addLights(scene);
    animate();
}