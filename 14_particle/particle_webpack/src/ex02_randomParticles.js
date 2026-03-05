import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/* 주제: 랜덤 파티클 */
// particle : 아주 작은 점(point)들을 많이 만들어서 효과를 만드는 기술
// BufferGeometry, PointsMaterial 사용

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
  const particleCount = 100; // 만들 파티클 개수
  const positions = new Float32Array(particleCount * 3); // 파티클의 위치(x,y,z)를 저장할 배열, 파티클 1개 = x,y,z → 값 3개 필요

  // 각 파티클의 좌표값 랜덤 생성
  for (let i = 0; i < positions.length; i++) {
    // -5 ~ 5 사이 랜덤 위치 생성
    positions[i] = (Math.random() - 0.5) * 10;
  }

  // geometry에 position 속성으로 정점 데이터 등록
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3) // 3개 값(x,y,z)이 하나의 vertex(정점)
  );

  const material = new THREE.PointsMaterial({
    size: 0.03, // 파티클의 기본 크기
    color: "green"
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
