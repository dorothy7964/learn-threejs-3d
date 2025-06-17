import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from "cannon-es"; //최신 버전으로 설치하기 위해 cannon 대신 cannon-es로 설치

/* 주제: cannon.js 기본 세팅 */
// cannon.js 문서
// http://schteppe.github.io/cannon.js/docs/
// 주의! https 아니고 http

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
  camera.position.y = 2;
  camera.position.z = 10;
  scene.add(camera);

  /* Light 만들기 */
  const ambientLight = new THREE.AmbientLight("white", 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight("white", 1);
  directionalLight.position.x = 1;
  directionalLight.position.z = 2;
  scene.add(directionalLight);

  /* Controls 만들기 */
  new OrbitControls(camera, renderer.domElement);

  /* Cannon(물리 엔진) */
  // 1. 월드 생성
  const cannonWorld = new CANNON.World();
  cannonWorld.gravity.set(0, -10, 0); // 중력 적용, (x, y, z) 위에서 아래로 표현하기 때문에 y값만 넣어줌

  // 2. 물리 바디 생성

  /* Mesh 만들기기 */
  // 바닥 만들기
  const floorMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
      color: "slategray"
    })
  );
  floorMesh.rotation.x = -Math.PI / 2; // 바닥 눕히기, Math.PI = 180도
  scene.add(floorMesh);

  // 박스 만들기
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const boxMaterial = new THREE.MeshStandardMaterial({
    color: "seagreen"
  });
  const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
  boxMesh.position.y = 0.5;
  scene.add(boxMesh);

  /* 그리기 */
  const clock = new THREE.Clock();

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

  /* 이벤트 */
  window.addEventListener("resize", setSize);

  draw();
}
