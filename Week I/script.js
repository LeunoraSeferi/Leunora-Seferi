import * as THREE from 'three';

const scene = new THREE.Scene();
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const sizes = {
    width: 800,
    height: 600
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
camera.position.x = 1;
scene.add(camera);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
document.getElementById("scene").appendChild(renderer.domElement);

// Animation Loop
const animate = function () {
    requestAnimationFrame(animate);

    // Rotate the mesh
    mesh.rotation.x += 0.01; // Rotate around the X axis
    mesh.rotation.y += 0.01; // Rotate around the Y axis

    renderer.render(scene, camera);
};

// Start the animation
animate();