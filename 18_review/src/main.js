import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { camera } from "./core/camera";
import { renderer } from "./core/renderer";
import { scene } from "./core/scene";
import { cameraControls } from "./systems/CameraControls.js";

/* 복습: 3D 공간 움직이는 캐릭터 */

// ===== Light =====
const ambientLight = new THREE.AmbientLight("white", 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight("white", 1);
directionalLight.position.x = 1;
directionalLight.position.z = 2;
scene.add(directionalLight);

/// ===== Messh =====
const geometry = new THREE.BoxGeometry(1, 1, 1, 16, 16, 16); // Segments가 적용된 박스
const material = new THREE.MeshStandardMaterial({
  color: "seagreen",
  side: THREE.DoubleSide, // 객체의 표면이 양면에서 렌더링
  wireframe: true // 표면이 실선으로만 표현
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// ===== LOOP =====
const timer = new THREE.Timer();

function animate() {
  const delta = timer.getDelta();

  // cameraControls.update(); // 1.상태 업데이트
  renderer.render(scene, camera); // 2. 렌더링, 장면을 카메라 시점으로 렌더링
  window.requestAnimationFrame(animate); // 3. 다음 프레임 예약
}

function setSize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight); // 브라우저 화면 리사이즈 대응
}

// 이벤트
window.addEventListener("resize", setSize);

animate();
