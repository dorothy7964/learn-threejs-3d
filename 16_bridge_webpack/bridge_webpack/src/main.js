import { worldContext, sceneConfig } from "./common";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/* 주제: The Bridge 게임 만들기 */

/* Renderer 만들기 : html에 캔버스 미리 만들기 */
// canvas는 common.js에서 생성
const renderer = new THREE.WebGLRenderer({
  canvas: worldContext.canvas,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

/* ===============================
	======= Scene 만들기 =======
=============================== */
// Scene은 common.js에서 생성
worldContext.scene.background = new THREE.Color(sceneConfig.backgroundColor);

/* ===============================
  ======= Camera 만들기 =======
=============================== */
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.y = 1.5;
camera.position.z = 4;
worldContext.scene.add(camera);

/* ===============================
  ======= Light 만들기 =======
=============================== */
const ambientLight = new THREE.AmbientLight("white", 0.5);
worldContext.scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight("white", 1);
directionalLight.position.x = 1;
directionalLight.position.z = 2;
worldContext.scene.add(directionalLight);

/* ===============================
  ======= Controls 만들기 =======
=============================== */
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

/* ===============================
  ======= Mesh 만들기 =======
=============================== */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({
  color: "seagreen"
});
const mesh = new THREE.Mesh(geometry, material);
worldContext.scene.add(mesh);

/* ===============================
  ======= 그리기 =======
=============================== */
const clock = new THREE.Clock();
function draw() {
  const delta = clock.getDelta();

  controls.update();

  renderer.render(worldContext.scene, camera);
  window.requestAnimationFrame(draw);
}

/* ===============================
	======= 이벤트 함수 =======
=============================== */
function setSize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(worldContext.scene, camera);
}

/* ===============================
	======= 이벤트 =======
=============================== */
window.addEventListener("resize", setSize);

draw();
