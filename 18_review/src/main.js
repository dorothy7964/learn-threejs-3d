import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/* 복습: 3D 공간 움직이는 캐릭터 */

// ===== Renderer =====
const canvas = document.querySelector("#three-canvas");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

// ===== Scene =====
const scene = new THREE.Scene();

// ===== Camera =====
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 4;
scene.add(camera);

// ===== Light =====
const ambientLight = new THREE.AmbientLight("white", 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight("white", 1);
directionalLight.position.x = 1;
directionalLight.position.z = 2;
scene.add(directionalLight);

// ===== Controls =====
new OrbitControls(camera, renderer.domElement); // 마우스를 이용해  3D 객체를 회전, 확대, 축소 가능

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

function draw() {
  const delta = timer.getDelta();

  renderer.render(scene, camera);
  window.requestAnimationFrame(draw);
}

function setSize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}

// 이벤트
window.addEventListener("resize", setSize);

draw();
