import * as THREE from 'three';

let camera,
    scene,
    renderer,
    mesh,
    mesh2;

const canvas = document.querySelector("#c");

document.getElementById("test").innerHTML = "";

const main = () => {
    init();
    animate();
};

main();

function init() {
    renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1234ff);

    camera = new THREE.OrthographicCamera(-10, 10, 10, -10, -10, 10);

    var texture = new THREE.TextureLoader().load('out.png');
    var texture2 = new THREE.TextureLoader().load('middle.png');

    var material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true
    });

    var material2 = new THREE.MeshBasicMaterial({
        map: texture2,
        transparent: true
    });

    var geometry = new THREE.SphereGeometry(9.98, 50, 50);
    mesh = new THREE.Mesh(geometry, material);

    var geometry2 = new THREE.SphereGeometry(10, 50, 50);
    mesh2 = new THREE.Mesh(geometry2, material2);

    mesh.rotation.y = -Math.PI / 2;
    mesh2.rotation.y = -Math.PI / 2;

    scene.add(mesh);
    scene.add(mesh2);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    renderer.render(scene, camera);
    mesh2.rotation.y -= 0.0009;
    mesh.rotation.y += 0.0009;
}

/*
Math.radians = function (degrees) {
    return degrees * Math.PI / 180;
};

var offset = $("canvas").offset();

$("old").on("mousemove", function () {
    pos = (((360 * (event.pageX - window.innerWidth / 2) / window.innerWidth) * Math.PI / 180) / 2) - Math.PI / 2;
    pos2 = ((360 * (event.pageY - window.innerHeight / 8) / window.innerHeight) * Math.PI / 180) - Math.PI / 2;

    mesh2.rotation.y = -pos - Math.PI;
    mesh.rotation.y = pos;

    mesh2.rotation.x = pos2 / 10;
    mesh.rotation.x = pos2 / 10;
});

$(document).on("mousemove touchmove touchstart", function (e) {

    e.preventDefault();

    var touchstart = e.type === 'touchstart' || e.type === 'touchmove',
        e = touchstart ? e.originalEvent : e,
        pageX = touchstart ? e.targetTouches[0].pageX : e.pageX,
        pageY = touchstart ? e.targetTouches[0].pageY : e.pageY;

    pos = (((360 * (event.pageX - window.innerWidth / 2) / window.innerWidth) * Math.PI / 180) / 2) - Math.PI / 2;

    pos2 = ((360 * (event.pageY - window.innerHeight / 8) / window.innerHeight) * Math.PI / 180) - Math.PI / 2;

    mesh2.rotation.y = -pos - Math.PI;
    mesh.rotation.y = pos;

    mesh2.rotation.x = pos2 / 10;
    mesh.rotation.x = pos2 / 10;
});
*/
