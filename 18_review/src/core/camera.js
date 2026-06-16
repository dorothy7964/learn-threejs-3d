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

// 카메라 위치 설정
camera.position.copy(cameraPosition);
console.log("📢 [camera.js:17]", camera.position);

// 화면 확대/축소 비율
camera.zoom = 0.2;

// 변경된 zoom 값을 카메라에 반영
// updateProjectionMatrix: 카메라 설정이 바뀌었을 때 그 변경사항을 실제 카메라에 적용하는 함수
camera.updateProjectionMatrix();

// 씬에 카메라 추가
scene.add(camera);
