import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const GREEN = 0x81a684;
const TAN = 0xfdba95;
const BLUE = 0x55a199;
const RED = 0xff6b6b;
const YELLOW = 0xfade7d;

const DEBUG = false;

const BOARD_DIAMETER = 3;

let camera, scene, renderer;
let stats, controls, clock;
let board;

let boardState = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
];

let MY_TURN = true;

const container = document.querySelector("#container");

init();
animate();

function xzToRowCol(x, z) {
    let row, col;

    if (x < -0.5) {
        col = 0;
    } else if (x > 0.5) {
        col = 2;
    } else {
        col = 1;
    }

    if (z < -0.5) {
        row = 0;
    } else if (z > 0.5) {
        row = 2;
    } else {
        row = 1;
    }

    console.log(`x: ${x}, y: ${z}`);
    
    return [row, col];
}

function onCanvasClick(event) {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects([board], true);

    if (intersects.length > 0) {
        const point = intersects[0].point;
        const [row, col] = xzToRowCol(point.x, point.z);

        console.log(`Row: ${row}, Col: ${col}`);

        if (MY_TURN) {
            placeX(row, col);
        } else {
            placeO(row, col);
        }
        MY_TURN = !MY_TURN;
        
        checkForWinner();

        console.log(boardState);
    }
}

function checkForWinner() {
    // Check rows
    for (let i = 0; i < 3; i++) {
        if (boardState[i][0] === boardState[i][1] && boardState[i][1] === boardState[i][2]) {
            if (boardState[i][0] === 'X') {
                alert('X wins!');
            } else if (boardState[i][0] === 'O') {
                alert('O wins!');
            }
        }
    }
    
    // Check columns
    for (let i = 0; i < 3; i++) {
        if (boardState[0][i] === boardState[1][i] && boardState[1][i] === boardState[2][i]) {
            if (boardState[0][i] === 'X') {
                alert('X wins!');
            } else if (boardState[0][i] === 'O') {
                alert('O wins!');
            }
        }
    }
}

function placeO(row, col) {
    const x = col - 1;
    const z = row - 1;
    
    const y = 0.2; // TODO - not accurate

    const oGeometry = new THREE.TorusGeometry(0.3, 0.05, 6, 100);
    const oMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const oMesh = new THREE.Mesh(oGeometry, oMaterial);
    oMesh.position.set(x, y, z);
    oMesh.rotation.x = Math.PI / 2; // Rotate it to be flat

    scene.add(oMesh);
    
    boardState[row][col] = 'O';
}

function placeX(row, col) {
    const x = col - 1;
    const z = row - 1;
    
    const y = 0.2; // TODO - not accurate

    const xMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const xGeometry = new THREE.BoxGeometry(0.1, 1, 0.1);

    const xMesh1 = new THREE.Mesh(xGeometry, xMaterial);
    const xMesh2 = new THREE.Mesh(xGeometry, xMaterial);

    xMesh1.rotation.z = Math.PI / 4;
    xMesh2.rotation.z = -Math.PI / 4;

    const xGroup = new THREE.Group();
    xGroup.add(xMesh1);
    xGroup.add(xMesh2);
    xGroup.position.set(x, y, z);
    xGroup.rotation.x = Math.PI / 2; // Rotate it to be flat

    scene.add(xGroup);

    boardState[row][col] = 'X';
}

function initTicTacToeBoard() {
    board = new THREE.Group();
    
    // Board
    const boardHeight = 0.2;
    const boardMesh = new THREE.Mesh(
        new THREE.BoxGeometry(3, boardHeight, 3), // Assuming each cell is 3x3 units
        new THREE.MeshLambertMaterial({color: 0xf4a261})
    );
    boardMesh.position.set(0, boardHeight / 2, 0);
    board.add(boardMesh);

    // Hit box
    if (DEBUG) {
        const hitBox = new THREE.BoxGeometry(1, 1, 1);
        const hitMaterial = new THREE.MeshLambertMaterial({color: 0xffffff, transparent: true, opacity: 0.2});
        
        for (let x = -1; x < 2; x++) {
            for (let z = -1; z < 2; z++) {
                const hit = new THREE.Mesh(hitBox, hitMaterial);
                hit.position.set(x, 0.5, z);
                board.add(hit);
            }
        }
    }

    // Lines
    const lineWidth = 0.2, lineHeight = 0.2, lineDepth = 3.0;
    const lineGeometryVertical = new THREE.BoxGeometry(lineWidth, lineHeight, lineDepth);
    const lineGeometryHorizontal = new THREE.BoxGeometry(lineDepth, lineHeight, lineWidth);
    const lineMaterial = new THREE.MeshLambertMaterial({color: 0x264653});

    const y_line = lineHeight / 2 + boardHeight;

    // Vertical Lines
    for (let x = 0; x < 2; x++) {
        const line = new THREE.Mesh(lineGeometryVertical, lineMaterial);
        line.position.set(x - 0.5, y_line, 0.0);
        board.add(line);
    }

    // Horizontal Lines
    for (let z = 0; z < 2; z++) {
        const line = new THREE.Mesh(lineGeometryHorizontal, lineMaterial);
        line.position.set(0.0, y_line, z - 0.5);
        board.add(line);
    }

    scene.add(board);
}

function init() {
    camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 15);
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(BLUE);

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

    // Lights
    const ambient = new THREE.HemisphereLight(0xffffff, 0xbfd4d2, 3);
    scene.add( ambient );

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight.position.set(1, 4, 3).multiplyScalar(3);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.setScalar( 2048 );
    directionalLight.shadow.bias = - 1e-4;
    directionalLight.shadow.normalBias = 1e-4;
    scene.add(directionalLight);

    // Tic-Tac-Toe Board
    initTicTacToeBoard();

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    
    renderer.domElement.addEventListener('click', onCanvasClick, false);

    window.addEventListener('resize', onWindowResize);

    // Clock
    clock = new THREE.Clock();

    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    
    // Stats
    stats = new Stats();
    container.appendChild(stats.dom);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    // Update HUD with camera position
    const hud = document.getElementById('hud');
    hud.textContent = `Position: x=${camera.position.x.toFixed(2)}, y=${camera.position.y.toFixed(2)}, z=${camera.position.z.toFixed(2)}`;
    hud.textContent += `; Rotation: ${camera.rotation.x.toFixed(2)}, ${camera.rotation.y.toFixed(2)}, ${camera.rotation.z.toFixed(2)}`

    renderer.render(scene, camera);
    stats.update();
}
