import * as THREE from "three";

export const canvas = document.querySelector("#three-canvas");

export const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});

// 렌더 기본 세팅
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

// 그림자 활성화
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
