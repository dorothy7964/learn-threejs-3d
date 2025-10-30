import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from "cannon-es"; //최신 버전으로 설치하기 위해 cannon 대신 cannon-es로 설치
import { PreventDragClick } from "./PreventDragClick";
import { MySphere } from "./MySphere";

/* 주제: 충돌 사운드 넣기 */

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
  renderer.shadowMap.enabled = true; // 그림자
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 그림자 부드럽게 적용

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
  directionalLight.castShadow = true; // 그림자
  scene.add(directionalLight);

  /* Controls 만들기 */
  new OrbitControls(camera, renderer.domElement);

  /* Cannon(물리 엔진) */
  // 1. 월드 생성
  const cannonWorld = new CANNON.World();
  cannonWorld.gravity.set(0, -10, 0); // 중력 적용, (x, y, z) 위에서 아래로 표현하기 때문에 y값만 넣어줌

  /* 성능을 위한 세팅 */
  cannonWorld.allowSleep = true; // 안 움직이는 물체는 계산 안 하게 하는 옵션 : body가 엄청 느려지면 테스트를 멈춤
  cannonWorld.broadphase = new CANNON.SAPBroadphase(cannonWorld);
  // SAPBroadphase // 충돌 가능성만 빠르게 판별, 가장 효율적
  // NaiveBroadphase // 기본값, 모든 물체끼리 전부 비교, 가장 느림
  // GridBroadphase // 같은 구역에 있는 물체들만 비교

  // 2. Contact Material : 재질에 따른 마찰력과 반발력

  // 재질 정의
  const defaultMaterial = new CANNON.Material("default"); // 기본 재질

  // 재질과 재질이 만났을 때의 상세 성질을 정의, 부딪칠 재질을 넣어주기
  const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
      friction: 0.1, // 마찰력
      restitution: 0.5 // 반박력
    }
  );

  // canoonWorld에 ContactMaterial 적용
  cannonWorld.defaultContactMaterial = defaultContactMaterial; // 기본 Material로 지정

  // 3. 물리 바디 생성

  /* 물리 바닥 만들기 */
  // 물리 시뮬레이션에서 움직이지 않는 바닥 역할을 하는 객체를 정의하기
  const floorShape = new CANNON.Plane();

  // floorBody : 물리 시뮬레이션에 참여하여 중력, 충돌 등의 영향을 받아 움직이는 실체
  const floorBody = new CANNON.Body({
    mass: 0, // 중력,  0으로 설정하면 해당 바디는 정적인(static) 객체가 된다.
    position: new CANNON.Vec3(0, 0, 0), // 위치
    shape: floorShape, // 형태 설정
    material: defaultMaterial // Contact Material 기본 재질로 적용
  });

  // plane는 기본적으로 Y축을 따라 수직으로 서 있는 형태
  // 이를 일반적인 바닥처럼 수평으로 눕히려면 회전(rotation)을 적용
  // Quaternion은 3D 공간에서 회전(rotation)을 표현하는 데 사용되는 수학적 객체
  floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI / 2);

  // 월드에 Body 추가
  cannonWorld.addBody(floorBody);

  /* Mesh 만들기 */
  // 바닥 만들기
  const floorMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
      color: "slategray"
    })
  );
  floorMesh.rotation.x = -Math.PI / 2; // 바닥 눕히기, Math.PI = 180도
  floorMesh.receiveShadow = true; // 그림자
  scene.add(floorMesh);

  // 공 모양, 재질
  const spheres = [];

  const radius = 0.5;
  const sphereGeometry = new THREE.SphereGeometry(radius);
  const sphereMaterial = new THREE.MeshStandardMaterial({
    color: "seagreen"
  });

  /* 그리기 */
  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();

    let cannonStepTime = 1 / 60;
    if (delta < 0.01) cannonStepTime = 1 / 120; // 화면 주사율에 맞춰 유동적으로 대응하기 위함
    cannonWorld.step(cannonStepTime, delta, 3);

    // 랜덤 위치 공 생성
    spheres.forEach((item) => {
      item.mesh.position.copy(item.cannonBody.position);
      item.mesh.quaternion.copy(item.cannonBody.quaternion);
    });

    renderer.render(scene, camera);
    window.requestAnimationFrame(draw);
  }

  function setSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  // 사운드 경로
  const sound = new Audio("/sounds/boing.mp3");

  /* 충돌 이벤트 */
  function collide(e) {
    const velocity = e.contact.getImpactVelocityAlongNormal();
    console.log("📢 [ex05_collisionSound.js:158]", velocity);
    if (velocity > 3) {
      sound.currentTime = 0; //충돌이 될때마다 처음부터 다시 재생
      sound.play(); // 충돌이 있을 때마다 사운드 플레이
    }
  }

  /* 이벤트 */
  window.addEventListener("resize", setSize);

  // 클릭할 때마다 랜덤한 위치에 공 추가하기
  canvas.addEventListener("click", () => {
    const mySphere = new MySphere({
      radius,
      scene,
      cannonWorld,
      geometry: sphereGeometry,
      material: sphereMaterial,
      x: (Math.random() - 0.5) * 2, // x좌표를 가운데(0)을 기준으로 좌우로 랜덤하게 배치
      y: Math.random() * 5 + 2, // 바닥에서 약간 위쪽에만 구가 생성되게 하려는 것
      z: (Math.random() - 0.5) * 2, // 앞뒤로 살짝 흩뿌리듯 랜덤 배치
      scale: Math.random() + 0.2
    });

    spheres.push(mySphere);

    mySphere.cannonBody.addEventListener("collide", collide);
  });

  const preventDragClick = new PreventDragClick(canvas); // 캔버스 드래그 시 힘 적용 방지

  draw();
}
