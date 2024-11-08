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
camera.position.set(0, 10, 10); // Adjusted Z position for visibility
camera.lookAt(0, 0, 0);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff, 1); // Background color to match your Next.js code
renderer.shadowMap.enabled = true; // Enable shadow map
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft shadows

// Attach the renderer to the DOM
document.body.appendChild(renderer.domElement);

// Lighting setup
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10).normalize();
directionalLight.castShadow = true;
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xeeeeee); 
scene.add(ambientLight);

// Geometry
const buildingS = new THREE.BoxGeometry(1, 2, 1);
const buildingL = new THREE.BoxGeometry(1, 5, 1);
const roadGeometry = new THREE.PlaneGeometry(1, 10);
const plain = new THREE.PlaneGeometry(10, 10);
const animatedSphereGeometry = new THREE.SphereGeometry(0.2, 32, 32);

// Materials
const materialGrass = new THREE.MeshStandardMaterial({ color: 0x2cd159 }); 
const materialRoad = new THREE.MeshStandardMaterial({ color: 0x454745 });
const materialBuilding301 = new THREE.MeshStandardMaterial({ color: 0xf5f3f2 });
const materialBuilding302 = new THREE.MeshStandardMaterial({ color: 0xf5f3f2 });
const materialBuilding801 = new THREE.MeshStandardMaterial({ color: 0x319aeb });
const materialSphere = new THREE.MeshStandardMaterial({ color: 0xff0000, metalness: 0.5, roughness: 0.5 }); // Reflective material

// Meshes
const grass = new THREE.Mesh(plain, materialGrass);
const road = new THREE.Mesh(roadGeometry, materialRoad);
const road1 = new THREE.Mesh(roadGeometry, materialRoad);
const building301 = new THREE.Mesh(buildingS, materialBuilding301);
const building302 = new THREE.Mesh(buildingS, materialBuilding302);
const building801 = new THREE.Mesh(buildingL, materialBuilding801);
const animatedSphere = new THREE.Mesh(animatedSphereGeometry, materialSphere);

// rotations
grass.rotation.x = -Math.PI / 2;
road.rotation.x = -Math.PI / 2;
road1.rotation.x = -Math.PI / 2;
building301.rotation.x = -Math.PI / 2;
building302.rotation.x = -Math.PI / 2;
building801.rotation.x = -Math.PI / 2;

// Positioning
building301.position.set(3.2, 0.5, 1);
building302.position.set(3.2, 0.5, -3);
road.position.set(2, 0.01, 0);
road1.position.set(-1.35, 0.01, 0);
road1.rotateZ(0.74);
building801.position.set(-1, 0.5, -1.9);
building801.rotateZ(0.74);

// Positioning animated object on the road
animatedSphere.position.set(2, 0.5, -4); // Start at the beginning of the first road

// Add objects to the scene
scene.add(grass, road, road1, building301, building302, building801, animatedSphere);

// Add Edges (Outlines) to the objects with matching color
function addEdges(mesh) {
  const edges = new THREE.EdgesGeometry(mesh.geometry);
  const color = mesh.material.color; // Use the color of the object’s material
  const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: color, linewidth: 2 }));
  mesh.add(line);
}

addEdges(building301);
addEdges(building302);
addEdges(building801);
addEdges(road);
addEdges(road1);

// GSAP Animation - Continuous movement along both roads, with back-and-forth motion
gsap.timeline({ repeat: -1, yoyo: true }) // Infinite loop with back and forth motion
  .to(animatedSphere.position, { x: 2, z: 4, duration: 3, ease: 'power1.inOut' })   // Move forward on road
  .to(animatedSphere.position, { x: -1.5, z: 0, duration: 3, ease: 'power1.inOut' }) // Transition to road1
  .to(animatedSphere.position, { x: -1.5, z: 0, duration: 0, ease: 'power1.inOut' }) // Move along road1
  .to(animatedSphere.position, { x: 2, z: -4, duration: 0, ease: 'power1.inOut' });   // Transition back to road



// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI / 2; // Restrict to top-down view
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