import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/* 주제: Geometry 정점(Vertex) position 이용하기 */

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
  new OrbitControls(camera, renderer.domElement); // 마우스를 이용해  3D 객체를 회전, 확대, 축소 가능

  /* Messh 만들기 */
  const geometry = new THREE.SphereGeometry(5, 64, 64);
  // const geometry = new THREE.PlaneGeometry(10, 10, 32, 32);

  const material = new THREE.MeshStandardMaterial({
    color: "orangered",
    side: THREE.DoubleSide,
    flatShading: true
  });

  const mesh = new THREE.Mesh(geometry, material);

  scene.add(mesh);

  /* vertex 조정 : 처음 위치를 랜덤으로 셋팅 */
  const positionArray = geometry.attributes.position.array; // 위치 정보 배열 값
  const randomArray = [];

  // 랜덤 값 생성 함수
  function getRandomAdjustment() {
    // 범위와 부드러움 설정
    const range = 0.5;
    const smoothness = 0.2;

    return (Math.random() - range) * smoothness;
  }

  // 정점(Vertex) 한 개의 x, y, z 좌표를 랜덤으로 조정
  for (let i = 0; i < positionArray.length; i += 3) {
    const positionOffsetX = getRandomAdjustment();
    const positionOffsetY = getRandomAdjustment();
    const positionOffsetZ = getRandomAdjustment();

    // 위치 배열 업데이트
    positionArray[i] += positionOffsetX;
    positionArray[i + 1] += positionOffsetY;
    positionArray[i + 2] += positionOffsetZ;

    // 랜덤 배열에 값 저장
    randomArray[i] = positionOffsetX;
    randomArray[i + 1] = positionOffsetY;
    randomArray[i + 2] = positionOffsetZ;
  }

  /* 그리기 */
  const clock = new THREE.Clock();

  function draw() {
    // 경과 시간, 처음 실행된 시점이 0에서 초 단위로 시간 값이 리턴
    const speed = 3;
    const time = clock.getElapsedTime() * speed;
    const range = 100;

    for (let i = 0; i < positionArray.length; i += 3) {
      const randomX = randomArray[i] * range;
      const randomY = randomArray[i + 1] * range;
      const randomZ = randomArray[i + 2] * range;

      const amplitude = 0.001; // 진폭
      positionArray[i] += Math.sin(time + randomX) * amplitude;
      positionArray[i + 1] += Math.sin(time + randomY) * amplitude;
      positionArray[i + 2] += Math.sin(time + randomZ) * amplitude;
    }

    // 위치 값 업데이트
    geometry.attributes.position.needsUpdate = true;

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
