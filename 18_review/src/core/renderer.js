import * as THREE from "three";

// ===== Renderer =====
// html에 캔버스 미리 만들기
// renderer 만들기 :  renderer가 화면에 그림을 그려주는 역할을 한다.
export const canvas = document.querySelector("#three-canvas"); // html의 캔버스 태그 가져오기
export const renderer = new THREE.WebGLRenderer({
  canvas, // 랜더러를 만들고 캔버스의 속성의 값을 캔버스로 지정하주기
  antialias: true // 계단 현상을 줄여 화면을 부드럽게 표시
});

// 렌더 초기 세팅
renderer.setSize(window.innerWidth, window.innerHeight); // 랜더러 사이즈를 브라우저 사이즈로 맞추기
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1); // 디바이스 픽셀 비율을 설정

// 그림자 활성화
renderer.shadowMap.enabled = true; // 그림자 활성화 유무
renderer.shadowMap.type = THREE.PCFShadowMap; // 그림자 부드럽게 적용
