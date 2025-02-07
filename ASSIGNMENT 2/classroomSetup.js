// classroomSetup.js - Handles setting up the classroom structure and models
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export function createClassroom(scene) {
  // Load textures
  const textureLoader = new THREE.TextureLoader();
  const floorTexture = textureLoader.load("/textures/floor.jpg");
  const wallTexture = textureLoader.load("/textures/wall.png");
  const ceilingTexture = textureLoader.load("/textures/ceiling.jpg");

  // Floor
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(16, 20),
    new THREE.MeshStandardMaterial({ map: floorTexture })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0, 0);
  scene.add(floor);

  // Walls
  const wallMaterial = new THREE.MeshStandardMaterial({ map: wallTexture });

  // Front wall (with window)
  const frontWall = new THREE.Mesh(
    new THREE.BoxGeometry(16, 3, 0.1),
    wallMaterial
  );
  frontWall.position.set(0, 1.5, -10);
  scene.add(frontWall);

  // Back wall
  const backWall = new THREE.Mesh(
    new THREE.BoxGeometry(16, 3, 0.1),
    wallMaterial
  );
  backWall.position.set(0, 1.5, 10);
  scene.add(backWall);

  // Left window
  const windowMaterial = new THREE.MeshStandardMaterial({
    color: 0xacfaed,
    opacity: 0.6,
    transparent: true,
    metalness: 0.6,
    roughness: 0.20,
  });

  const windowMesh = new THREE.Mesh(
    new THREE.BoxGeometry(20, 3, 0.1),
    windowMaterial
  );
  windowMesh.position.set(-8.2, 1.5, 0);
  windowMesh.rotation.y = Math.PI / 2;
  scene.add(windowMesh);

  // Right wall
  const rightWall = new THREE.Mesh(
    new THREE.BoxGeometry(20, 3, 0.1),
    wallMaterial
  );
  rightWall.position.set(8, 1.5, 0);
  rightWall.rotation.y = Math.PI / 2;
  scene.add(rightWall);

  // Ceiling
  const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(16, 20),
    new THREE.MeshStandardMaterial({ map: ceilingTexture })
  );
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = 3;
  scene.add(ceiling);
}

export function loadModels(scene) {
  const loader = new GLTFLoader();

  // Load desks and chairs in a 2x3 grid
  const numRows = 2;
  const numCols = 3;
  const deskSpacingX = 4;
  const deskSpacingZ = 4;

  loader.load("/objects/school_desk/school_desk.gltf", (gltf) => {
    const deskModel = gltf.scene;
    deskModel.scale.set(1.4, 1.4, 1.4);

    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const deskClone = deskModel.clone();
        deskClone.position.set(
          -((numCols - 1) * deskSpacingX) / 2 + col * deskSpacingX,
          0,
          -((numRows - 1) * deskSpacingZ) / 2 + row * deskSpacingZ
        );
        scene.add(deskClone);
      }
    }
  });

  loader.load("/objects/school_chair/school_chair.gltf", (gltf) => {
    const chairModel = gltf.scene;
    chairModel.scale.set(6, 6, 6);

    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const chairClone = chairModel.clone();
        chairClone.position.set(
          -((numCols - 1) * deskSpacingX) / 2 + col * deskSpacingX - 0.5,
          0,
          -((numRows - 1) * deskSpacingZ) / 2 + row * deskSpacingZ - 0.3
        );
        scene.add(chairClone);
      }
    }
  });

  // Second pair of chairs
  loader.load("/objects/school_chair/school_chair.gltf", (gltf) => {
    const chairModel = gltf.scene;
    chairModel.scale.set(6, 6, 6);

    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const chairClone = chairModel.clone();
        chairClone.position.set(
          -((numCols - 1) * deskSpacingX) / 2 + col * deskSpacingX + 0.5,
          0,
          -((numRows - 1) * deskSpacingZ) / 2 + row * deskSpacingZ - 0.3
        );
        scene.add(chairClone);
      }
    }
  });

  // Load additional classroom objects
  const models = [
    { file: "whiteboard/whiteboard.gltf", pos: [0, 1.9, 9.3], scale: 0.01, rotation: [0, -Math.PI, 0] }, // Whiteboard in correct orientation
    { file: "door/door.gltf", pos: [8, 1.2, 7.9], scale: 0.014 },

    // Teacher's desk and chair (same as student models)
    { file: "school_desk/school_desk.gltf", pos: [-3, -0, 7.5], scale: 1.4, rotation: [0, 0, 0] }, // Teacher's desk
    { file: "school_chair/school_chair.gltf", pos: [-3, -0, 7.9], scale: 6, rotation: [0, -Math.PI, 0] }, // Teacher's chair facing students

    { file: "ceiling_light/ceiling_light.gltf", pos: [0, 2.8, 0], scale: 0.01 }, // Further reduced ceiling light size
    { file: "book_shelf/book_shelf.gltf", pos: [-6, -0, -9.7], scale: 1.8 } // Bookshelf size adjusted
  ];

  models.forEach(({ file, pos, scale = 1, rotation = [0, 0, 0] }) => {
    loader.load(`/objects/${file}`, (gltf) => {
      const model = gltf.scene;
      model.position.set(...pos);
      model.scale.set(scale, scale, scale);
      model.rotation.set(...rotation);
      scene.add(model);
    });
  });
}
