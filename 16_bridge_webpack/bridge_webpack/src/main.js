import * as THREE from "three";
import * as CANNON from "cannon-es";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Bar } from "./Bar";
import { Floor } from "./Floor";
import { Glass } from "./Glass";
import { Pillar } from "./Pillar";
import { Player } from "./Player";
import { SideLight } from "./SideLight";
import { geo, sceneConfig, worldContext } from "./common";
import {
  canStepOnGlass,
  movePlayer,
  handleFail,
  playJumpAnimation
} from "./logic/glass/checkClickedObject";

/* 주제: The Bridge 게임 만들기 */

/* Renderer 만들기 : html에 캔버스 미리 만들기 */
const canvas = document.querySelector("#three-canvas");
const renderer = new THREE.WebGLRenderer({
  canvas,
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
	======= CANNON  =======
=============================== */
/* 물리 엔진, 중력 */
worldContext.world.gravity.set(0, -10, 0); // 현실 중력 : -9.82 / 게임용 : -10 → 살짝 더 빠르게 떨어짐

/* 물리 충돌 속성 설정 */
// 기본 재질끼리 충돌
const defaultContactMaterial = new CANNON.ContactMaterial(
  worldContext.defaultMaterial,
  worldContext.defaultMaterial,
  {
    friction: 0.3, // 미끄러움 (0~1, 낮을수록 잘 미끄러짐)
    restitution: 0.2 // 튕김 정도 (0~1, 높을수록 잘 튕김)
  }
);

// 유리 vs 기본 물체
const glassDefaultContactMaterial = new CANNON.ContactMaterial(
  worldContext.glassMaterial,
  worldContext.defaultMaterial,
  {
    friction: 1, // 거의 안 미끄러짐 (딱 붙는 느낌)
    restitution: 0 // 튕기지 않음
  }
);

// 플레이어 vs 유리
const playerGlassContactMaterial = new CANNON.ContactMaterial(
  worldContext.playerMaterial,
  worldContext.glassMaterial,
  {
    friction: 1, // 안정적으로 서있게
    restitution: 0 // 점프 후 튕김 방지
  }
);

// 기본 충돌 설정 (모든 기본 재질에 적용)
worldContext.world.defaultContactMaterial = defaultContactMaterial;

// 특정 재질 조합 충돌 설정 추가
worldContext.world.addContactMaterial(glassDefaultContactMaterial);
worldContext.world.addContactMaterial(playerGlassContactMaterial);

/* ===============================
  ======= Mesh 만들기 =======
=============================== */
const dynamicObjects = []; // 움직이는 물리 객체(기둥, 유리판, 플레이어)

// ===== 유리판 기본 설정 (직접 조절하는 값) =====
const GLASS_UNIT_SIZE = 1.2; // 유리판 한 개 크기
const GLASS_COUNT = 10; // 유리판 개수
const PILLAR_SPACING_UNITS = 24; // 기둥 간 간격 (유리판 개수 기준)

// ===== 유리판 파생 값 (위 설정으로 자동 계산) =====
const HALF_SPACING = PILLAR_SPACING_UNITS / 2; // 중심 기준 한쪽 기둥 위치
const EDGE_OFFSET = GLASS_UNIT_SIZE / 2; // 유리판 경계에 맞추기 위한 보정값
const BAR_LENGTH = GLASS_UNIT_SIZE * (GLASS_COUNT * 2 + 1); // 징검다리바 전체 길이

/* 바닥 */
const floor = new Floor({
  name: "floor"
});

/* 기둥 */
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

dynamicObjects.push(pillar1, pillar2); // 움직이는 물리 객체

/* 징검다리 바 */
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

/* 유리판 */
// ===== 유리판 파생 값 (위 설정으로 자동 계산) =====
const START_Z = -((GLASS_COUNT - 1) * GLASS_UNIT_SIZE * 2) / 2; // 유리들을 중앙 기준으로 정렬하기 위한 시작 위치

//유리판의 z 좌표들을 저장할 배열
const glassZ = [];
for (let i = 0; i < GLASS_COUNT; i++) {
  glassZ.push(-(START_Z + i * GLASS_UNIT_SIZE * 2)); //  마이너스 부호 붙인 건 방향 뒤집어서 카메라 기준 앞으로 배치하려는 의도
}

for (let i = 0; i < GLASS_COUNT; i++) {
  // 왼쪽이 일반유리(normal)인지 랜덤으로 결정 (50% 확률)
  const isLeftNormal = Math.random() < 0.5;

  const glass1 = new Glass({
    name: `glass-${isLeftNormal ? "normal" : "strong"}`,
    x: -1,
    y: 10.5,
    z: glassZ[i],
    step: i + 1,
    type: isLeftNormal ? "normal" : "strong",
    cannonMaterial: worldContext.glassMaterial
  });

  const glass2 = new Glass({
    name: `glass-${isLeftNormal ? "strong" : "normal"}`,
    x: 1,
    y: 10.5,
    z: glassZ[i],
    step: i + 1,
    type: isLeftNormal ? "strong" : "normal",
    cannonMaterial: worldContext.glassMaterial
  });

  dynamicObjects.push(glass1, glass2); // 움직이는 물리 객체
}

/* 플레이어 */
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
  mass: 30,
  rotationY: Math.PI, // Math.PI = 180도
  cannonMaterial: worldContext.playerMaterial
});

dynamicObjects.push(player); // 움직이는 물리 객체

/* 클릭 처리 (Raycaster) */
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// 클릭한 위치에서 가장 먼저 맞은 오브젝트 하나만 처리하는 함수
function checkIntersects() {
  // 마우스 좌표(mouse)를 기준으로 카메라에서 레이를 생성
  raycaster.setFromCamera(mouse, camera);

  // 레이캐스터로 현재 씬 안에 있는 모든 객체와의 교차 검사
  const intersects = raycaster.intersectObjects(worldContext.scene.children);

  // 교차된 객체들을 순서대로 확인 (가까운 순)
  for (const item of intersects) {
    // 실제로 맞은 3D 객체 :" item.object
    // 유리판 단계 :  item.object.step

    // 클릭된 객체에 대한 처리 함수 실행 : 현재 유리판을 밟아야 할 순서인지 확인
    const isValidStep = canStepOnGlass(item.object);

    if (isValidStep) {
      handleJump(item.object);
    }

    // 가장 가까운 객체 하나만 처리하고 종료
    break;
  }
}

// 점프 처리 실행
function handleJump(mesh) {
  playJumpAnimation(player.actions); // 점프 애니메이션 실행

  sceneConfig.jumping = true;
  sceneConfig.step++; // 다음 스텝으로 진행
  movePlayer(mesh, player, glassZ); // 플레이어 이동

  // 일반 유리 → 실패 처리
  if (mesh.type === "normal") {
    handleFail(player.actions, sideLights);
  }

  // 일정 시간 후 점프 상태 해제
  setTimeout(() => {
    sceneConfig.jumping = false;
  }, 1000);
}

/* ===============================
  ======= 그리기 =======
=============================== */
const timer = new THREE.Timer();
function draw() {
  timer.update();
  const delta = timer.getDelta();

  // 플레이어 애니메이션 업데이트 (시간 흐름 적용)
  if (worldContext.mixer) worldContext.mixer.update(delta); // glb 로드 전 mixer 접근 방지

  /* 물리 엔진 프레임 업데이트 (Cannon.js step 실행) */
  let cannonStepTime = 1 / 60; // 물리 시뮬레이션을 일정한 시간 간격(1/60초)으로 계산하기 위한 고정 스텝 값

  // Cannon.js 물리 엔진을 한 프레임마다 업데이트
  // (고정 스텝, 실제 프레임 간격 delta, 최대 보정 횟수 3)
  worldContext.world.step(cannonStepTime, delta, 3);

  /* 물리 바디 → 렌더 객체 위치/회전 동기화 함수 */
  const syncTransform = (target, body, applyRotation = false) => {
    if (!target) return; // 대상 객체 없으면 종료

    target.position.copy(body.position); // 위치 동기화

    if (applyRotation) {
      // 일반 유리 밟을 경우 캐릭터 회전 적용
      target.quaternion.copy(body.quaternion); // 회전 동기화
    }
  };

  /* 물체 위치를 물리 바디와 동기화 */
  dynamicObjects.forEach((item) => {
    const body = item.cannonBody;
    if (!body) return; // 물리 바디 없는 객체는 제외

    const isPlayer = item.name === "player"; // 플레이어 여부

    // 기본 메쉬 동기화
    syncTransform(item.mesh, body);

    if (isPlayer) {
      syncTransform(item.modelMesh, body, sceneConfig.fail); // 플레이어 모델은 실패 시에만 회전 적용
      item.modelMesh.position.y += 0.15; // 플레이어 위치 조정
    }
  });

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

/* 클릭 처리 : 마우스 클릭 위치를 WebGL 좌표계(-1 ~ 1)로 변환 */
canvas.addEventListener("click", (e) => {
  // 마우스 X 좌표를 0 ~ canvas 너비 → -1 ~ 1로 변환
  mouse.x = (e.clientX / canvas.clientWidth) * 2 - 1;

  // 마우스 Y 좌표를 0 ~ canvas 높이 → -1 ~ 1로 변환
  // (WebGL은 Y축이 반대라서 앞에 - 붙임)
  mouse.y = -((e.clientY / canvas.clientHeight) * 2 - 1);

  // 클릭한 위치에서 가장 먼저 맞은 오브젝트 하나만 처리하는 함수
  checkIntersects();
});

draw();
