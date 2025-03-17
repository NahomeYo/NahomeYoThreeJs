import * as THREE from 'three';
import { GLTFLoader } from 'https://unpkg.com/three@0.139.2/examples/jsm/loaders/GLTFLoader.js';

// Global variables
let renderer, scene, camera, controls, width, height, sceneContainer;
let model;
let nahomeMixer, catMixer, ccMixer, ccAppsMixer, vsMixer, vsAppsMixer;

const clock = new THREE.Clock();
controls = new OrbitControls(camera, container);

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

    window.addEventListener('resize', () => {
        width = sceneContainer.clientWidth;
        height = sceneContainer.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
    })

    function render() {
        renderer.render(scene, camera);
    }
}

// CAMERA
function createCamera() {
    const FOV = 60.34;
    const aspect = width / height;
    const near = 0.1;
    const far = 2000.00;

    camera = new THREE.PerspectiveCamera(FOV, aspect, near, far);
    camera.position.set(-0.580, 1.420, -1.000);
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
        scene.add(model);

        nahomeMixer = new THREE.AnimationMixer(model);
        let walkAction = nahomeMixer.clipAction(THREE.AnimationClip.findByName(gltf.animations, 'walking'));
        let idleAction = nahomeMixer.clipAction(THREE.AnimationClip.findByName(gltf.animations, 'idle'));
        let flyingAction = nahomeMixer.clipAction(THREE.AnimationClip.findByName(gltf.animations, 'flying'));
        let jumpingAction = nahomeMixer.clipAction(THREE.AnimationClip.findByName(gltf.animations, 'jumping'));
        let landingAction = nahomeMixer.clipAction(THREE.AnimationClip.findByName(gltf.animations, 'landing'));

        walkAction.play();
    })

    loader.load("./models/land.glb", function (gltf) {
        let root = gltf.scene;
        root.castShadow = true;

        scene.add(root);
    });

    loader.load("./models/creativeCloud.glb", function (gltf) {
        let root = gltf.scene;
        scene.add(root);

        ccMixer = new THREE.AnimationMixer(root);
        const clips = gltf.animations;

        const clip001 = THREE.AnimationClip.findByName(clips, 'adobeFloat');
        const floatAction = ccMixer.clipAction(clip001);
        floatAction.play();
    });

    loader.load("./models/creativeCloudAppsRotate.glb", function (gltf) {
        let root = gltf.scene;
        root.castShadow = true;
        scene.add(root);

        ccAppsMixer = new THREE.AnimationMixer(root);
        const clips = gltf.animations;

        const clip001 = THREE.AnimationClip.findByName(clips, 'CCrotateAction');
        const rotateAction = ccAppsMixer.clipAction(clip001);
        rotateAction.play();
    });

    loader.load("./models/githubOctoCat.glb", function (gltf) {
        let root = gltf.scene;
        root.castShadow = true;
        scene.add(root);

        catMixer = new THREE.AnimationMixer(root);
        const clips = gltf.animations;

        const clip001 = THREE.AnimationClip.findByName(clips, 'catRotate');
        const clip002 = THREE.AnimationClip.findByName(clips, 'floatAnim');
        const clip003 = THREE.AnimationClip.findByName(clips, 'tailsAnim');
        const clip004 = THREE.AnimationClip.findByName(clips, 'tailWiggle');

        clips.forEach((clip) => {
            catMixer.clipAction(clip).play();
        })
    });

    loader.load("./models/vsLanguagesRotate.glb", function (gltf) {
        let root = gltf.scene;
        root.castShadow = true;
        scene.add(root);

        vsAppsMixer = new THREE.AnimationMixer(root);
        const clips = gltf.animations;

        const clip001 = THREE.AnimationClip.findByName(clips, 'VSrotateAction');
        const rotateAction = vsAppsMixer.clipAction(clip001);
        rotateAction.play();
    });

    loader.load("./models/visualStudioIcon.glb", function (gltf) {
        let root = gltf.scene;
        root.castShadow = true;
        scene.add(root);

        vsMixer = new THREE.AnimationMixer(root);
        const clips = gltf.animations;

        const clip001 = THREE.AnimationClip.findByName(clips, 'VSFloat');
        const floatAction = vsMixer.clipAction(clip001);
        floatAction.play();
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
export function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x6c9696);
    controls = new OrbitControls(camera, container);

    width = sceneContainer.clientWidth;
    height = sceneContainer.clientHeight;
    scene.fog = new THREE.Fog(0x6c9696, 90, 100);

    createRenderer();
    createCamera();
    addModel(scene);
    addLights(scene);
    animate();

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        const delta = clock.getDelta();
        const time = clock.getElapsedTime();

        if (nahomeMixer) nahomeMixer.update(delta);
        if (catMixer) catMixer.update(delta);
        if (ccMixer) ccMixer.update(delta);
        if (ccAppsMixer) ccAppsMixer.update(delta);
        if (vsMixer) vsMixer.update(delta);
        if (vsAppsMixer) vsAppsMixer.update(delta);

        renderer.render(scene, camera);
    }
}