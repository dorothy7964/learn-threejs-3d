import { worldContext, sceneConfig, geo } from "./common";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Pillar } from "./Pillar";
import { Floor } from "./Floor";
import { Bar } from "./Bar";
import { SideLight } from "./SideLight";
import { Glass } from "./Glass";
import { Player } from "./Player";

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
renderer.shadowMap.type = THREE.PCFShadowMap; // 부드러운 그림자 타입 사용 (가장 자연스러운 그림자)

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
camera.position.set(-4, 19, 14); // (x, y, z)
worldContext.scene.add(camera);

/* ===============================
  ======= Light 만들기 =======
=============================== */
// AmbientLight : 장면 전체를 균일하게 밝히는 기본 조명
const ambientLight = new THREE.AmbientLight(sceneConfig.lightColor, 2);
worldContext.scene.add(ambientLight);

// SpotLight : 특정 방향으로 원뿔 형태로 빛 쏘는 조명
const spotLightDistance = 30; // 조명을 얼마나 떨어뜨릴지 거리 설정

const spotLight1 = new THREE.SpotLight(sceneConfig.lightColor, 10000);
spotLight1.castShadow = true; // 그림자 생성 활성화
spotLight1.shadow.mapSize.width = 2048; // 그림자 해상도 설정 (가로 2048 → 선명도 ↑)
spotLight1.shadow.mapSize.height = 2048; // 그림자 해상도 설정 (세로 2048 → 선명도 ↑)
const spotLight2 = spotLight1.clone();
const spotLight3 = spotLight1.clone();
const spotLight4 = spotLight1.clone();

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

// ===== 유리판 기본 설정 (직접 조절하는 값) =====
const GLASS_UNIT_SIZE = 1.2; // 유리판 한 개 길이
const GLASS_COUNT = 10; // 유리판 개수
const PILLAR_SPACING_UNITS = 24; // 기둥 간 간격 (유리판 개수 기준)

// ===== 유리판 파생 값 (위 설정으로 자동 계산) =====
const HALF_SPACING = PILLAR_SPACING_UNITS / 2; // 중심 기준 한쪽 기둥 위치
const EDGE_OFFSET = GLASS_UNIT_SIZE / 2; // 유리판 경계에 맞추기 위한 보정값
const BAR_LENGTH = GLASS_UNIT_SIZE * (GLASS_COUNT * 2 + 1); // 징검다리바 전체 길이

// 바닥
const floor = new Floor({
  name: "floor"
});

// 기둥
// ===== 기둥 기본 설정 (직접 조절하는 값) =====
// common 파일에 geo 값 조절하면 됨

// ===== 기둥 파생 값 (위 설정으로 자동 계산) =====
const PILLAR_HEIGHT = geo.pillar.parameters.height || 5;
const FLOOR_HEIGHT = geo.floor.parameters.height || 1;
const PILLAR_TOP_OFFSET_Y = FLOOR_HEIGHT / 2 + PILLAR_HEIGHT / 2; // 예) 바닥 두께 절반 (0.5) + 기둥 절반(5) = 5.5

// Three.js는 기본적으로 중앙 기준으로 생성된다
const pillar1 = new Pillar({
  name: "pillar",
  x: 0,
  y: PILLAR_TOP_OFFSET_Y,
  z: -GLASS_UNIT_SIZE * HALF_SPACING - EDGE_OFFSET
});

const pillar2 = new Pillar({
  name: "pillar",
  x: 0,
  y: PILLAR_TOP_OFFSET_Y,
  z: GLASS_UNIT_SIZE * HALF_SPACING + EDGE_OFFSET
});

// 징검다리 바
const bar1 = new Bar({ name: "bar", x: -1.6, y: 10.3, z: 0 });
const bar2 = new Bar({ name: "bar", x: -0.4, y: 10.3, z: 0 });
const bar3 = new Bar({ name: "bar", x: 0.4, y: 10.3, z: 0 });
const bar4 = new Bar({ name: "bar", x: 1.6, y: 10.3, z: 0 });

// 징검다리 바에 사이드 조명 넣기

// ===== 조명 기본 설정 (직접 조절하는 값) =====
const LIGHT_COUNT = 49; // 조명 개수
const LIGHT_GAP = 0.5; // 조명 간격

// ===== 파생 값 (위 설정으로 자동 계산) =====
const LIGHT_OFFSET = BAR_LENGTH / 2; // 중앙 정렬용 offset

function createSideLights(container) {
  const lights = [];

  for (let i = 0; i < LIGHT_COUNT; i++) {
    lights.push(
      new SideLight({
        name: "sideLight",
        container,
        z: i * LIGHT_GAP - LIGHT_OFFSET
      })
    );
  }

  return lights;
}

const sideLights = [
  ...createSideLights(bar1.mesh),
  ...createSideLights(bar4.mesh)
];

// 유리판
// ===== 유리판 파생 값 (위 설정으로 자동 계산) =====
const START_Z = -((GLASS_COUNT - 1) * GLASS_UNIT_SIZE * 2) / 2; // 유리들을 중앙 기준으로 정렬하기 위한 시작 위치

for (let i = 0; i < GLASS_COUNT; i++) {
  // 왼쪽이 일반유리(normal)인지 랜덤으로 결정 (50% 확률)
  const isLeftNormal = Math.random() < 0.5;

  const glass1 = new Glass({
    name: "glass",
    x: -1,
    y: 10.5,
    z: START_Z + i * GLASS_UNIT_SIZE * 2,
    type: isLeftNormal ? "normal" : "strong"
  });

  const glass2 = new Glass({
    name: "glass",
    x: 1,
    y: 10.5,
    z: START_Z + i * GLASS_UNIT_SIZE * 2,
    type: isLeftNormal ? "strong" : "normal"
  });
}

// 플레이어
// ===== 플레이어 기본 설정 (직접 조절하는 값) =====
const PLAYER_HEIGHT = 11.8; // 플레이 크기 임의로 적어줌
const PLAYER_OFFSET_Z = 1; // 플레이어 간격 조정

// ===== 플레이어 파생 값 (위 설정으로 자동 계산) =====
const PLAYER_Y = PLAYER_HEIGHT / 2 + PILLAR_HEIGHT / 2; // 기둥 절반 높이 + 플레이어 절반 높이

const player = new Player({
  name: "player",
  x: pillar2.x, // 기둥 기준
  y: PLAYER_Y,
  z: Math.floor(pillar2.z) - PLAYER_OFFSET_Z,
  rotationY: Math.PI // Math.PI = 180도
});

/* ===============================
  ======= 그리기 =======
=============================== */
const timer = new THREE.Timer();
function draw() {
  timer.update();
  const delta = timer.getDelta();

  // 플레이어 애니메이션 업데이트 (시간 흐름 적용)
  if (worldContext.mixer) worldContext.mixer.update(delta); // glb 로드 전 mixer 접근 방지

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
