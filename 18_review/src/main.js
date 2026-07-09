import * as THREE from "three";
import { camera } from "./core/camera";
import "./core/lights";
import { renderer } from "./core/renderer";
import { scene } from "./core/scene";
import { cameraControls } from "./systems/CameraControls.js";
import { Floor } from "./world/Floor";

/* 복습: 3D 공간 움직이는 캐릭터 */

// ===== floor =====
new Floor(scene);

// ===== LOOP =====
const timer = new THREE.Timer();

function animate() {
  const delta = timer.getDelta();

  cameraControls.update(); // 1.상태 업데이트
  renderer.render(scene, camera); // 2. 렌더링, 장면을 카메라 시점으로 렌더링
  window.requestAnimationFrame(animate); // 3. 다음 프레임 예약
}

function setSize() {
  // OrthographicCamera에는 camera.aspect가 적용되지 않는다.
  // left, right, top, bottom을 직접 변경해야 한다.
  const aspect = window.innerWidth / window.innerHeight;
  camera.left = -aspect;
  camera.right = aspect;
  camera.top = 1;
  camera.bottom = -1;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight); // 브라우저 화면 리사이즈 대응
}

// 이벤트
window.addEventListener("resize", setSize);

setSize(); // 초기 설정
animate();
