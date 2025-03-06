import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Select the container
const container = document.getElementById('canvas3');

// Create scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x211414);

// Create camera
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / window.innerHeight, 0.1, 1000);
camera.position.set(1, 1, 3); // Adjusted for better view

// Create renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0;
controls.rotateSpeed = 0.5;
controls.minDistance = 1;
controls.maxDistance = 2.5;
controls.enableZoom = true;

// Clock for animation
const clock = new THREE.Clock();

const loader = new GLTFLoader();
let mixer;
let cupcake;
let zoomDirection = null; // "in" for zoom-in, "out" for zoom-out

// Load GLTF model
loader.load(
    'cup-cake.glb',
    (gltf) => {
        cupcake = gltf.scene;
        scene.add(cupcake);

        // Set default position, rotation, and scale
        cupcake.position.set(0, 0, 0);
        cupcake.rotation.set(0, 0, 0);
        cupcake.scale.set(6,6,6); // Normal size

        console.log("Model Loaded:", cupcake);
        console.log("Animations:", gltf.animations);

        if (gltf.animations.length > 0) {
            mixer = new THREE.AnimationMixer(cupcake);
            gltf.animations.forEach((clip) => {
                const action = mixer.clipAction(clip);
                action.setLoop(THREE.LoopRepeat);
                action.play();
            });
        } else {
            console.warn("No animations found in GLTF file!");
        }

        animate();
    },
    (xhr) => {
        console.log(`Loading: ${(xhr.loaded / xhr.total) * 100}% loaded`);
    },
    (error) => {
        console.error('Error loading model:', error);
    }
);

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    if (cupcake) {
        // Smooth zoom-in or zoom-out
        const zoomSpeed = 0.05;
        if (zoomDirection === "in") {
            cupcake.scale.lerp(new THREE.Vector3(1.5, 1.5, 1.5), zoomSpeed);
        } else if (zoomDirection === "out") {
            cupcake.scale.lerp(new THREE.Vector3(1, 1, 1), zoomSpeed);
        }

        // **Rotation Animation** (Rotate around Y-axis)
        cupcake.rotation.y += 0.01;

        // **Bouncing Effect** (Up-down smooth motion)
        cupcake.position.y = Math.sin(elapsedTime * 2) * 0.1;
    }

    if (mixer) mixer.update(clock.getDelta());
    controls.update();
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    renderer.setSize(container.clientWidth, window.innerHeight);
    camera.aspect = container.clientWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Keyboard controls for zooming in and out
window.addEventListener('keydown', (event) => {
    if (event.key === "z") {
        zoomDirection = "in";  // Zoom in
    } else if (event.key === "x") {
        zoomDirection = "out"; // Zoom out
    }
});

window.addEventListener('keyup', (event) => {
    if (event.key === "z" || event.key === "x") {
        zoomDirection = null; // Stop zooming
    }
});
