// See FPS demo: https://threejs.org/examples/?q=FPS#games_fps
// Source: https://github.com/mrdoob/three.js/blob/master/examples/games_fps.html

import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const GREEN = 0x81a684;
const TAN = 0xfdba95;
const BLUE = 0x55a199;
const RED = 0xff6b6b;
const YELLOW = 0xfade7d;

const MOVE_SPEED = 5;

const moveDirection = {
    forward: false,
    backward: false,
    left: false,
    right: false
};

document.addEventListener('keydown', function(event) {
    console.log(`keydown = ${event.code}`);

    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveDirection.forward = true;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveDirection.backward = true;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveDirection.left = true;
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveDirection.right = true;
            break;
    }
});

document.addEventListener('keyup', function(event) {
    console.log(`keyup = ${event.code}`);

    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveDirection.forward = false;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveDirection.backward = false;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveDirection.left = false;
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveDirection.right = false;
            break;
    }
});

let camera, scene, renderer;
let stats, controls, clock;
let cubes;

const canvas = document.querySelector("#c");

init();
animate();

function createRenderer() {
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    return renderer;
}

function createCamera() {
    const fov = 45;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 15;

    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    return camera;
}

function makeCubeInstance(geometry, color, x) {
    const material = new THREE.MeshPhongMaterial({ color });
    const cube = new THREE.Mesh(geometry, material);
    cube.castShadow = true;
    cube.position.set(x, 0, 0);

    scene.add(cube);

    return cube;
}

function createScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(BLUE);

    // Lights
    const ambient = new THREE.HemisphereLight(0xffffff, 0xbfd4d2, 3);
    scene.add(ambient);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight.position.set(1, 4, 3).multiplyScalar(3);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.setScalar( 2048 );
    directionalLight.shadow.bias = - 1e-4;
    directionalLight.shadow.normalBias = 1e-4;
    scene.add(directionalLight);
    
    // Ground
    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(50, 50),
        new THREE.MeshPhongMaterial({
            color: TAN,
            specular: 0x101010
        })
    );
    plane.position.set(0, 0, 0);
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    scene.add(plane);

    return scene;
}

function init() {
    camera = createCamera();
    renderer = createRenderer();
    scene = createScene();

    camera.position.set(0, 7.5, 7.5);
    camera.lookAt(0, 0, 0);

    cubes = [
        makeCubeInstance(new THREE.BoxGeometry(1, 1, 1), RED, 0),
        makeCubeInstance(new THREE.BoxGeometry(1, 1, 1), GREEN, -2),
        makeCubeInstance(new THREE.BoxGeometry(1, 1, 1), YELLOW, 2)
    ];

    // Clock
    clock = new THREE.Clock();

    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.maxPolarAngle = 0.9 * Math.PI / 2;
    controls.enableZoom = false;
    
    // Stats
    stats = new Stats();
    container.appendChild(stats.dom);
}

function animate() {
    requestAnimationFrame(animate);

    const deltaTime = clock.getDelta();
    updateCameraPosition(deltaTime);

    // Update HUD with camera position
    const hud = document.getElementById('hud');
    hud.textContent = `Position: x=${camera.position.x.toFixed(2)}, y=${camera.position.y.toFixed(2)}, z=${camera.position.z.toFixed(2)}`;
    hud.textContent += `; Rotation: ${camera.rotation.x.toFixed(2)}, ${camera.rotation.y.toFixed(2)}, ${camera.rotation.z.toFixed(2)}`

    cubes.forEach((cube, index) => {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        cube.position.y = 2 + Math.sin((clock.elapsedTime + index) * 2);
    });

    renderer.render(scene, camera);
    stats.update();
}

function updateCameraPosition(deltaTime) {
    const c = deltaTime * MOVE_SPEED;

    const dx = (moveDirection.right & 1) - (moveDirection.left & 1);
    const dz = (moveDirection.forward & 1) - (moveDirection.backward & 1);

    camera.translateX(dx * c);
    camera.translateZ(-dz * c);
}
