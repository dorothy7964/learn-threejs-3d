import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { KeyController } from "./KeyController";

/* 주제: Minecraft Controls :  PointerLockControls에 키보드 컨트롤 추가 */

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
  camera.position.y = 1.5;
  camera.position.z = 4;
  scene.add(camera);

  /* Light 만들기 */
  const ambientLight = new THREE.AmbientLight("white", 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight("white", 1);
  directionalLight.position.x = 1;
  directionalLight.position.z = 2;
  scene.add(directionalLight);

  /* Controls 만들기 */
  const controls = new PointerLockControls(camera, renderer.domElement);

  // 클릭 시 포인터 잠금 활성화
  controls.domElement.addEventListener("click", () => {
    controls.lock();
  });

  // 잠금 설정 시 호출
  controls.addEventListener("lock", () => {
    console.log("lock!");
  });

  // 잠금 해제 시 호출 (Esc 키 누를 시 잠금 해제 됨)
  controls.addEventListener("unlock", () => {
    console.log("unlock!");
  });

  /* 키보드 컨트롤 만들기 */
  const keyController = new KeyController();

  function walk() {
    const UP = keyController.keys["KeyW"] || keyController.keys["ArrowUp"];
    const DOWN = keyController.keys["KeyS"] || keyController.keys["ArrowDown"];
    const LEFT = keyController.keys["KeyA"] || keyController.keys["ArrowLeft"];
    const RIGHT =
      keyController.keys["KeyD"] || keyController.keys["ArrowRight"];

    const moveAmount = 0.02; // 이동량을 상수로 정의

    if (UP) {
      controls.moveForward(moveAmount);
    }
    if (DOWN) {
      controls.moveForward(-moveAmount);
    }
    if (LEFT) {
      controls.moveRight(-moveAmount);
    }
    if (RIGHT) {
      controls.moveRight(moveAmount);
    }
  }

  /* Messh 만들기 */
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  let mesh;
  let material;

  const minColorValue = 50; // RGB 값의 최소값
  const colorRange = 255 - minColorValue; // RGB 값의 범위 (최대값 - 최소값)
  for (let i = 0; i < 20; i++) {
    material = new THREE.MeshStandardMaterial({
      color: `rgb(
				${minColorValue + Math.floor(Math.random() * colorRange)},
				${minColorValue + Math.floor(Math.random() * colorRange)},
				${minColorValue + Math.floor(Math.random() * colorRange)}
			)`
    });

    // Mesh 무작위 위치 조정
    const range = 0.5;
    const positionRange = 5;
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = (Math.random() - range) * positionRange;
    mesh.position.y = (Math.random() - range) * positionRange;
    mesh.position.z = (Math.random() - range) * positionRange;
    scene.add(mesh);
  }

  /* 그리기 */
  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();

    walk();

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
