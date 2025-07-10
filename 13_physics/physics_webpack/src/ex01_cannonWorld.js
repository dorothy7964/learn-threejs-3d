import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from "cannon-es"; //최신 버전으로 설치하기 위해 cannon 대신 cannon-es로 설치

/* 주제: cannon.js 기본 세팅 + 물리가 적용되는 객체 만들기 */
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

  /* 물리 바닥 만들기 */
  // 물리 시뮬레이션에서 움직이지 않는 바닥 역할을 하는 객체를 정의하기
  const floorShape = new CANNON.Plane();

  // floorBody : 물리 시뮬레이션에 참여하여 중력, 충돌 등의 영향을 받아 움직이는 실체
  const floorBody = new CANNON.Body({
    mass: 0, // 중력,  0으로 설정하면 해당 바디는 정적인(static) 객체가 된다.
    position: new CANNON.Vec3(0, 0, 0), // 위치
    shape: floorShape // 형태 설정
  });

  // plane는 기본적으로 Y축을 따라 수직으로 서 있는 형태
  // 이를 일반적인 바닥처럼 수평으로 눕히려면 회전(rotation)을 적용
  // Quaternion은 3D 공간에서 회전(rotation)을 표현하는 데 사용되는 수학적 객체
  floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI / 2);

  // 월드에 Body 추가
  cannonWorld.addBody(floorBody);

  /* 물리 박스 만들기 */
  // Cannon.js에서는 halfExtents이므로, 상자의 중심에서 각 면까지의 거리로 계산 해야 하며, Three.js 크기의 절반을 사용한다.
  const boxShape = new CANNON.Box(new CANNON.Vec3(0.25, 2.5, 0.25));

  const boxBody = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 10, 0),
    shape: boxShape
  });
  cannonWorld.addBody(boxBody);

  /* Mesh 만들기 */
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
  const boxGeometry = new THREE.BoxGeometry(0.5, 5, 0.5); // 직육면체 만들기
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

    let cannonStepTime = 1 / 60;
    if (delta < 0.01) cannonStepTime = 1 / 120; // 화면 주사율에 맞춰 유동적으로 대응하기 위함
    cannonWorld.step(cannonStepTime, delta, 3);

    boxMesh.position.copy(boxBody.position); // 위치
    // boxMesh.quaternion.copy(boxBody.quaternion); // 회전

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
