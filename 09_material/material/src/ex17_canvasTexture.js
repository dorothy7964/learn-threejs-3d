import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/* 주제: Material에 Canvas 사용하기 */

export default function example() {
  /* Renderer 만들기 : html에 캔버스 미리 만들기 */
  const canvas = document.querySelector("#three-canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  /* Scene 만들기 */
  const scene = new THREE.Scene();

  /* Camera 만들기 */
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 1.5, 4);
  scene.add(camera);

  /* Light 만들기 */
  // MeshBasicMaterial은 조명이 필요 없다.

  /* Controls 만들기 */
  new OrbitControls(camera, renderer.domElement);

  /* CanvasTexture 만들기 */
  // Canvas 요소 생성 및 텍스트, 도형 그리기
  const texCanvas = document.createElement("canvas");
  const texContext = texCanvas.getContext("2d"); // HTML5 캔버스 요소의 2D 렌더링 컨텍스트를 가져오는 코드
  texCanvas.width = 500;
  texCanvas.height = 500;
  // CanvasTexture로 변환하여 Three.js 텍스처 생성
  const canvasTexture = new THREE.CanvasTexture(texCanvas);

  /* Messh 만들기 */
  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const material = new THREE.MeshBasicMaterial({
    map: canvasTexture
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  /* 그리기 */
  const clock = new THREE.Clock();

  function draw() {
    const time = clock.getElapsedTime(); // getElapsedTime : 경과시간

    // 캔버스 텍스처 업데이트 : 애니메이션을 사용하기 위해 needsUpdate를 true 만들어주기
    material.map.needsUpdate = true;

    // 캔버스 배경색
    texContext.fillStyle = "orange";

    // 도형 그리기
    texContext.fillRect(0, 0, 500, 500);
    texContext.fillStyle = "white";
    texContext.fillRect(Math.sin(time) * 300, 100, 50, 50); // 경과 시간을 사용하여 sin 함수를 이용한 애니메이션

    // 텍스트 추가
    texContext.font = "bold 50px sans-serif";
    texContext.fillText("texContext", 200, 200);

    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }

  function setSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  /* 이벤트 */
  window.addEventListener("resize", setSize);

  draw();
}
