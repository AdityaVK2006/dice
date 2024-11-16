import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const roll = document.querySelector('.roll');
let i,j,k;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias: true});

const world = new CANNON.World();
world.gravity.set(0, -9.8, 0);
world.broadphase = new CANNON.NaiveBroadphase();
world.solver.iterations = 10;

renderer.setSize(window.innerWidth, window.innerHeight);
document.querySelector('.main').appendChild(renderer.domElement);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const controls = new OrbitControls(camera, renderer.domElement);

camera.position.z = 5;
camera.position.y = 4;

const textureLoader = new THREE.TextureLoader();

const one = textureLoader.load('one.png');
const two = textureLoader.load('two.svg');
const three = textureLoader.load('three.webp');
const four = textureLoader.load('four.jpg');
const five = textureLoader.load('five.webp');
const six = textureLoader.load('six.webp');

const materials = [
    new THREE.MeshStandardMaterial({map: five}),
    new THREE.MeshStandardMaterial({map: two}),
    new THREE.MeshStandardMaterial({map: six}),
    new THREE.MeshStandardMaterial({map: one}),
    new THREE.MeshStandardMaterial({map: four}),
    new THREE.MeshStandardMaterial({map: three})
];

const dice = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    materials
);
dice.position.y = 1.5;
scene.add(dice);

const diceBody = new CANNON.Body({
    mass: 0.5,
    shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
    position: new CANNON.Vec3(0, 2, 0),
});
world.addBody(diceBody);

roll.addEventListener('click', () => {
    i = Math.random()%10;
    j = Math.random()%10;
    k = Math.random()%10;
    diceBody.quaternion.setFromAxisAngle(new CANNON.Vec3(i,j,k), 1); 
});

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10,),
    new THREE.MeshStandardMaterial({color: 0x8B4513, side: THREE.DoubleSide})
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

const groundBody = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Plane()
});
groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
world.addBody(groundBody);

const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

const timeStep = 1 / 60;

function animate() {
    requestAnimationFrame(animate);
    world.step(timeStep);
    dice.position.copy(diceBody.position);
    dice.quaternion.copy(diceBody.quaternion);
    renderer.render(scene, camera);
    controls.update();
}

animate();
