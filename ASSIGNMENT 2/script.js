// script.js - Handles rendering, camera, and controls
import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { createClassroom, loadModels } from "./classroomSetup.js";

let scene, camera, renderer, controls;

function init() {
  // Scene setup
  scene = new THREE.Scene();

  // Camera setup
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 1.6, 5);

  // Renderer setup
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  // Lighting setup
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
  ambientLight.position.set(0, 0, 0);
  scene.add(ambientLight);

  const overheadLight1 = new THREE.PointLight(0xffffff, 3, 100, 1);
  overheadLight1.position.set(3, 2.8, 0);
  scene.add(overheadLight1);

  const overheadLight2 = new THREE.PointLight(0xffffff, 3, 100, 1);
  overheadLight2.position.set(5, 2.8, 0);
  scene.add(overheadLight2);

  const overheadLight3 = new THREE.PointLight(0xffffff, 3, 100, 1);
  overheadLight3.position.set(-5, 2.8, 0);
  scene.add(overheadLight3);

  const overheadLight4 = new THREE.PointLight(0xffffff, 3, 100, 1);
  overheadLight4.position.set(-3, 2.8, 0);
  scene.add(overheadLight4);
  //Skybox
  const cubeTextureLoader = new THREE.CubeTextureLoader();
  const skyboxTexture = cubeTextureLoader.load([
    "/textures/skybox/px.png", // Positive X (right)
    "/textures/skybox/nx.png", // Negative X (left)
    "/textures/skybox/py.png", // Positive Y (top)
    "/textures/skybox/ny.png", // Negative Y (bottom)
    "/textures/skybox/pz.png", // Positive Z (front)
    "/textures/skybox/nz.png", // Negative Z (back)
  ]);

  
  


  scene.background = skyboxTexture;
  // Classroom setup
  createClassroom(scene);
  loadModels(scene);

  // Pointer Lock Controls for first-person navigation
  controls = new PointerLockControls(camera, document.body);
  document.body.addEventListener("click", () => controls.lock());

  // Movement controls
  const movement = {
    forward: false,
    backward: false,
    left: false,
    right: false,
  };

  document.addEventListener("keydown", (e) => {
    switch (e.code) {
      case "KeyW":
        movement.forward = true;
        break;
      case "KeyS":
        movement.backward = true;
        break;
      case "KeyA":
        movement.left = true;
        break;
      case "KeyD":
        movement.right = true;
        break;
    }
  });

  document.addEventListener("keyup", (e) => {
    switch (e.code) {
      case "KeyW":
        movement.forward = false;
        break;
      case "KeyS":
        movement.backward = false;
        break;
      case "KeyA":
        movement.left = false;
        break;
      case "KeyD":
        movement.right = false;
        break;
    }
  });

  function animate() {
    requestAnimationFrame(animate);

    if (movement.forward) controls.moveForward(0.1);
    if (movement.backward) controls.moveForward(-0.1);
    if (movement.left) controls.moveRight(-0.1);
    if (movement.right) controls.moveRight(0.1);

    renderer.render(scene, camera);
  }

  animate();

  // Resize handler
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}


window.onload = init;
