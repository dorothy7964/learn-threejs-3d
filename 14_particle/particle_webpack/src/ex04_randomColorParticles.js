import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/* 주제: 여러가지 색상의 파티클 */

export default function example() {
  /* Renderer 만들기 : html에 캔버스 미리 만들기 */
  const canvas = document.querySelector("#three-canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  // Scene
  const scene = new THREE.Scene();

  // Camera
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
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  /* Points 만들기 */
  const geometry = new THREE.BufferGeometry(); // 3D 객체의 정점(vertex) 데이터를 저장할 Geometry 생성
  const particleCount = 1000; // 만들 파티클 개수
  const positions = new Float32Array(particleCount * 3); // 파티클의 위치(x,y,z)를 저장할 배열, 파티클 1개 = x,y,z → 값 3개 필요
  const colors = new Float32Array(particleCount * 3); // 여러 색상의 파티클을 위한 색상 배열 생성

  // 각 파티클의 좌표값 랜덤 생성
  for (let i = 0; i < positions.length; i++) {
    // -5 ~ 5 사이 랜덤 위치
    positions[i] = (Math.random() - 0.5) * 10;
    // 0 ~ 1 사이 랜덤 색상 값
    colors[i] = Math.random();
  }

  console.log("geometry", geometry);

  // geometry에 position 속성으로 정점 데이터 등록
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3) // 3개 값(x,y,z)이 하나의 vertex(정점)
  );

  // geometry에 색상 속성 추가 (RGB)
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  // 이미지 로드
  const textureLoader = new THREE.TextureLoader();
  const particleTexture = textureLoader.load("/images/star.png");

  const material = new THREE.PointsMaterial({
    size: 0.3, // 파티클의 기본 크기
    map: particleTexture,
    vertexColors: true, // geometry의 color 속성 사용

    /* 파티클 이미지를 투명하게 세팅 */
    transparent: true, // 투명 영역 허용 : 투명 부분이 실제 보이도록 설정
    alphaMap: particleTexture, // 투명도 정도 적용 : 불투명/투명 부분
    depthWrite: false // 깊이 정보 무시 : 여러 파티클이 겹쳐도 뒤쪽 파티클이 가려지지 않음
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  /* 그리기 */
  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();

    controls.update();

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
