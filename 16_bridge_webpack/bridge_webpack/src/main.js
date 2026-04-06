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
renderer.shadowMap.enabled = true; // 렌더러에서 그림자 기능 활성화
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 부드러운 그림자 타입 사용 (가장 자연스러운 그림자)

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
// AmbientLight : 장면 전체를 균일하게 밝히는 기본 조명
const ambientLight = new THREE.AmbientLight(sceneConfig.lightColor, 2);
worldContext.scene.add(ambientLight);

// SpotLight : 특정 방향으로 원뿔 형태로 빛 쏘는 조명

const spotLight1 = new THREE.SpotLight(sceneConfig.lightColor, 10000);
spotLight1.castShadow = true; // 그림자 생성 활성화
spotLight1.shadow.mapSize.width = 2048; // 그림자 해상도 설정 (가로 2048 → 선명도 ↑)
spotLight1.shadow.mapSize.height = 2048; // 그림자 해상도 설정 (세로 2048 → 선명도 ↑)
const spotLight2 = spotLight1.clone();
const spotLight3 = spotLight1.clone();
const spotLight4 = spotLight1.clone();

const spotLightDistance = 50; // 조명을 얼마나 떨어뜨릴지 거리 설정

// 각 조명을 사각형 꼭짓점 위치에 배치
spotLight1.position.set(
  -spotLightDistance,
  spotLightDistance,
  spotLightDistance
);
spotLight2.position.set(
  spotLightDistance,
  spotLightDistance,
  spotLightDistance
);
spotLight3.position.set(
  -spotLightDistance,
  spotLightDistance,
  -spotLightDistance
);
spotLight4.position.set(
  spotLightDistance,
  spotLightDistance,
  -spotLightDistance
);

worldContext.scene.add(spotLight1, spotLight2, spotLight3, spotLight4);

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
