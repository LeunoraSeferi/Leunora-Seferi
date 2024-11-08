import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gsap } from 'gsap';

// Scene setup
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 10, 10);
camera.lookAt(0, 0, 0);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff, 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Lighting setup
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10).normalize();
directionalLight.castShadow = true;
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xeeeeee);
scene.add(ambientLight);

// Function to create clearer, bolder numbered textures
function createNumberTexture(text) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 256;
  canvas.height = 256;

  // Background color and text styling
  context.fillStyle = '#f5f3f2'; // Light background
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Add shadow for better contrast
  context.shadowColor = '#000000';
  context.shadowBlur = 10;
  context.shadowOffsetX = 2;
  context.shadowOffsetY = 2;

  // Text styling
  context.fillStyle = '#000000'; // Black text
  context.font = 'bold 120px Arial'; // Larger and bolder text
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  // Create texture from canvas
  return new THREE.CanvasTexture(canvas);
}

// Materials with numbered textures
const materialBuilding301 = new THREE.MeshStandardMaterial({
  map: createNumberTexture('301'),
  color: 0xf5f3f2,
});
const materialBuilding302 = new THREE.MeshStandardMaterial({
  map: createNumberTexture('302'),
  color: 0xf5f3f2,
});
const materialBuilding801 = new THREE.MeshStandardMaterial({
  map: createNumberTexture('801'),
  color: 0x319aeb,
});

// Geometry
const buildingS = new THREE.BoxGeometry(1, 2, 1);
const buildingL = new THREE.BoxGeometry(1, 5, 1);
const roadGeometry = new THREE.PlaneGeometry(1, 10);
const plain = new THREE.PlaneGeometry(10, 10);
const animatedSphereGeometry = new THREE.SphereGeometry(0.2, 32, 32);

// Other Materials
const materialGrass = new THREE.MeshStandardMaterial({ color: 0x2cd159 });
const materialRoad = new THREE.MeshStandardMaterial({ color: 0x454745 });
const materialSphere = new THREE.MeshStandardMaterial({ color: 0x0eb2f0, metalness: 0.5, roughness: 0.5 });

// Meshes
const grass = new THREE.Mesh(plain, materialGrass);
const road = new THREE.Mesh(roadGeometry, materialRoad);
const road1 = new THREE.Mesh(roadGeometry, materialRoad);
const building301 = new THREE.Mesh(buildingS, materialBuilding301);
const building302 = new THREE.Mesh(buildingS, materialBuilding302);
const building801 = new THREE.Mesh(buildingL, materialBuilding801);
const animatedSphere = new THREE.Mesh(animatedSphereGeometry, materialSphere);

// Rotations
grass.rotation.x = -Math.PI / 2;
road.rotation.x = -Math.PI / 2;
road1.rotation.x = -Math.PI / 2;
building301.rotation.x = -Math.PI / 2;
building302.rotation.x = -Math.PI / 2;
building801.rotation.x = -Math.PI / 2;

// Positioning (Corrected)
building301.position.set(3.2, 0.5, -3); // Corrected position for 301
building302.position.set(3.2, 0.5, 1);  // Corrected position for 302
road.position.set(2, 0.01, 0);
road1.position.set(-1.35, 0.01, 0);
road1.rotateZ(0.74);
building801.position.set(-1, 0.5, -1.9);
building801.rotateZ(0.74);

// Positioning animated object on the road surface
animatedSphere.position.set(2, 0.2, -4);

// Add objects to the scene
scene.add(grass, road, road1, building301, building302, building801, animatedSphere);

// Add Edges (Outlines) to the objects with matching color
function addEdges(mesh) {
  const edges = new THREE.EdgesGeometry(mesh.geometry);
  const color = mesh.material.color;
  const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: color, linewidth: 2 }));
  mesh.add(line);
}

addEdges(building301);
addEdges(building302);
addEdges(building801);
addEdges(road);
addEdges(road1);

// GSAP Animation - Continuous movement along both roads, with back-and-forth motion
gsap.timeline({ repeat: -1, yoyo: true })
  .to(animatedSphere.position, { x: 2, z: 4, duration: 3, ease: 'power1.inOut' })
  .to(animatedSphere.position, { x: -1.5, z: 0, duration: 3, ease: 'power1.inOut' })
  .to(animatedSphere.position, { x: -1.5, z: 0, duration: 0, ease: 'power1.inOut' })
  .to(animatedSphere.position, { x: 2, z: -4, duration: 0, ease: 'power1.inOut' });

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI / 2;
controls.minPolarAngle = Math.PI / 4;

// Animation Loop
function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
