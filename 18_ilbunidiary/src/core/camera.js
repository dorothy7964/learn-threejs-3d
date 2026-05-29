import * as THREE from "three";
import { scene } from "./scene.js";

export const cameraPosition = new THREE.Vector3(1, 5, 5);

// Orthographic Camera 생성 (원근감 없는 2D 느낌)
export const camera = new THREE.OrthographicCamera(
  -(window.innerWidth / window.innerHeight),
  window.innerWidth / window.innerHeight,
  1,
  -1,
  -1000,
  1000
);

camera.position.copy(cameraPosition);
camera.zoom = 0.2;
camera.updateProjectionMatrix();
scene.add(camera);
