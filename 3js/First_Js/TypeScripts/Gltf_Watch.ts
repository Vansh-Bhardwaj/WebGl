import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import Stats from 'three/addons/libs/stats.module.js';
import * as CANNON from 'cannon-es';

// Type declarations
let watch: THREE.Mesh;
let watchBody: CANNON.Body;

// --- SCENE SETUP ---
const scene = new THREE.Scene();

const light = new THREE.SpotLight(undefined, Math.PI * 1000);
light.position.set(10, 5, 10);
light.angle = Math.PI / 2;
light.castShadow = true;
scene.add(light);

new RGBELoader().load('img/venice_sunset_1k.hdr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
});

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(1.5, 0.75, 2);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.1;
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// --- PHYSICS SETUP ---
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0); // Check if gravity aligns with your scene

// --- WATCH LOADING ---
new GLTFLoader().load('models/test.glb', (gltf) => {
  watch = gltf.scene.getObjectByName('Watch') as THREE.Mesh; 
  if (watch) { 
    watch.castShadow = true;

    // Ensure watchShape accurately represents the watch's geometry
    const watchShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));  
    watchBody = new CANNON.Body({ mass: 1 }); // Adjust mass if needed
    watchBody.addShape(watchShape);

    // Set a higher initial position
    watchBody.position.copy(new CANNON.Vec3(watch.position.x, watch.position.y + 2, watch.position.z));

    world.addBody(watchBody);
  }
  scene.add(gltf.scene);
});

// --- GROUND PLANE ---
const planeGeometry = new THREE.PlaneGeometry(25, 25);
const planeMesh = new THREE.Mesh(planeGeometry, new THREE.MeshPhongMaterial());
planeMesh.rotateX(-Math.PI / 2);
planeMesh.receiveShadow = true;
scene.add(planeMesh);

const planeShape = new CANNON.Plane();
const planeBody = new CANNON.Body({ mass: 0 }); 
planeBody.addShape(planeShape);
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
world.addBody(planeBody);

// --- STATS --- 
const stats = new Stats();
document.body.appendChild(stats.dom);

// --- ANIMATION LOOP ---
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  world.step(1/60); 

  if (watch && watchBody) {
    watch.position.copy(watchBody.position);
    watch.quaternion.copy(watchBody.quaternion);
  }

  renderer.render(scene, camera);
  stats.update();
}

animate();
