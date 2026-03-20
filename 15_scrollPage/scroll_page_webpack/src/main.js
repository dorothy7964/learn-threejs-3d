import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { House } from "./House";

/* 주제: 스크롤에 따라 움직이는 3D 페이지 */
// 1. 기본 구조 만들기
// 2. House 클래스 만들기
// 3. 객체 배치하고 애니메이션 처리하기

/* Renderer 만들기 : html에 캔버스 미리 만들기 */
const canvas = document.querySelector("#three-canvas");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.shadowMap.enabled = true; // 그림자 사용 ON
renderer.shadowMap.type = THREE.PCFShadowMap; // 부드러운 그림자 타입

/* ===============================
  ======= Scene 만들기 =======
=============================== */
const scene = new THREE.Scene();
scene.background = new THREE.Color("white");

/* ===============================
  ======= Camera 만들기 =======
=============================== */
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(-5, 2, 25);
scene.add(camera);

/* ===============================
  ======= Light 만들기 =======
=============================== */

// 1. 앰비언트 라이트 만들기
// 씬 전체를 은은하게 밝히는 기본 조명
// 그림자 없음, 방향성 없음
const ambientLight = new THREE.AmbientLight("white", 2); // 조명 색상, 조명 강도
scene.add(ambientLight); // 씬에 추가

// 2. 스포트라이트 만들기
// 특정 위치에서 한 방향으로 집중해서 비추는 빛
// 그림자 가능
const spotLight = new THREE.SpotLight("white", 10000); // 조명 색상, 조명 강도
spotLight.position.set(0, 15, 100); // 빛 위치 지정
spotLight.castShadow = true; // 그림자 활성화

// 3. 그림자 세부 설정
spotLight.shadow.mapSize.width = 1024; // 그림자 해상도 너비
spotLight.shadow.mapSize.height = 1024; // 그림자 해상도 높이
spotLight.shadow.camera.near = 1; // 그림자 카메라 근거리
spotLight.shadow.camera.far = 200; // 그림자 카메라 원거리

// 4. 씬에 스포트라이트 추가
scene.add(spotLight);

/* ===============================
  ======= Mesh 바닥 만들기 =======
=============================== */

// 1. 바닥 Mesh 생성 (floorMesh)
// PlaneGeometry: 평면 지오메트리 생성
// MeshStandardMaterial: 표준 재질 사용, 빛에 반응
const floorMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100), // 가로 100, 세로 100 평면
  new THREE.MeshStandardMaterial({ color: "red" }) // 바닥 색상
);

// 2. 회전 조정
// 기본 평면은 XY 평면
// 바닥처럼 보이도록 X축 -90도 회전
floorMesh.rotation.x = -Math.PI;

// 3. 그림자 설정 : 다른 오브젝트의 그림자를 받을 수 있도록 설정
floorMesh.receiveShadow = true;

// 4. 씬에 바닥 Mesh 추가
scene.add(floorMesh);

/* ===============================
======= houses glb 불러오기 =======
=============================== */
// 1. 모델 로더 생성
// GLTF(.glb/.gltf) 3D 모델 파일을 불러오는 로더
const gltfLoader = new GLTFLoader();

// 2. 하우스 모델 생성
// gltfLoader를 사용해 .glb 모델을 불러와 씬에 배치
const houses = [];
houses.push(
  new House({
    gltfLoader,
    scene,
    modelSrc: "/models/house.glb",
    x: -5,
    z: 20,
    height: 2
  })
);
houses.push(
  new House({
    gltfLoader,
    scene,
    modelSrc: "/models/house.glb",
    x: 7,
    z: 10,
    height: 2
  })
);
houses.push(
  new House({
    gltfLoader,
    scene,
    modelSrc: "/models/house.glb",
    x: -10,
    z: 0,
    height: 2
  })
);
houses.push(
  new House({
    gltfLoader,
    scene,
    modelSrc: "/models/house.glb",
    x: 10,
    z: -10,
    height: 2
  })
);
houses.push(
  new House({
    gltfLoader,
    scene,
    modelSrc: "/models/house.glb",
    x: -5,
    z: -20,
    height: 2
  })
);

/* ===============================
    ======= 그리기 =======
=============================== */
const clock = new THREE.Timer();

function draw() {
  const delta = clock.getDelta();

  renderer.render(scene, camera);
  window.requestAnimationFrame(draw);
}

function setSize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}

/* ===============================
    ======= 이벤트 =======
=============================== */
window.addEventListener("resize", setSize);

draw();
