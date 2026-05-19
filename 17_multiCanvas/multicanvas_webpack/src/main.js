import * as THREE from "three";
import "./main.css";
import { CreateScene } from "./CreateScene";

/* 주제: 주제: 여러개의 캔버스 사용하기 */

/* ===============================
  ======= Renderer =======
=============================== */
const canvas = document.querySelector("#three-canvas");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

/* ===============================
	======= Scene 만들기 =======
=============================== */
const sceneA = new CreateScene({
  renderer, // 공용 renderer 전달
  placeholder: ".canvas-placeholder.a" // Scene이 사용할 화면 영역 선택
});

/* ===============================
  ======= 그리기 =======
=============================== */
const clock = new THREE.Clock();

function draw() {
  const delta = clock.getDelta();

  window.requestAnimationFrame(draw);
}

function setSize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
}

/* ===============================
	======= 이벤트 =======
=============================== */
window.addEventListener("resize", setSize);

draw();
