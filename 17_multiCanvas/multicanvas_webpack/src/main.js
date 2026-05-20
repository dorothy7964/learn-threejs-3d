import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
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
  placeholder: ".canvas-placeholder.a", // Scene이 사용할 화면 영역 선택
  cameraPosition: { x: -1, y: 1, z: 2 }
});

sceneA.set(() => {
  // 조명 생성
  const light = new THREE.DirectionalLight("white", 1);
  light.position.set(-1, 2, 3);
  // sceneA.scene.add(light);

  // 카메라 설정
  sceneA.camera.add(light);
  sceneA.controls = new OrbitControls(sceneA.camera, sceneA.elem);

  // 형태 생성
  const geometry = new THREE.BoxGeometry(1, 1, 1);

  // 재질 생성
  const material = new THREE.MeshStandardMaterial({
    color: "green"
  });

  // 객체 생성
  const mesh = new THREE.Mesh(geometry, material);
  sceneA.scene.add(mesh);
});

/* ===============================
  ======= 그리기 =======
=============================== */
const clock = new THREE.Clock();

function draw() {
  const delta = clock.getDelta();

  // 현재 Scene 렌더링 실행
  // render() 내부에서 viewport, scissor 설정 후
  // 실제 화면에 객체를 그려줌
  sceneA.render();

  window.requestAnimationFrame(draw); // 다음 프레임 다시 실행
}

function setSize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
}

/* ===============================
	======= 이벤트 =======
=============================== */
window.addEventListener("resize", setSize);

draw();
