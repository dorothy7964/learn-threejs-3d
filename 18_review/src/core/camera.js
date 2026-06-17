import * as THREE from "three";
import { scene } from "./scene.js";

// 카메라 기본 위치
export const cameraPosition = new THREE.Vector3(1, 5, 5); // Vector3는 3차원 좌표를 저장하는 객체

// Orthographic Camera 생성
// 원근감 없이 모든 객체를 동일한 크기로 표시
export const camera = new THREE.OrthographicCamera(
  -(window.innerWidth / window.innerHeight), // left
  window.innerWidth / window.innerHeight, // right
  1, // top
  -1, // bottom
  -1000, // near
  1000 // far
);

camera.position.copy(cameraPosition); // 카메라 위치 설정
camera.zoom = 0.2; // 화면 확대/축소 비율
camera.updateProjectionMatrix(); // 변경된 zoom 값을 카메라에 반영 // 변경된 zoom 값을 카메라에 반영
scene.add(camera); // 씬에 카메라 추가
