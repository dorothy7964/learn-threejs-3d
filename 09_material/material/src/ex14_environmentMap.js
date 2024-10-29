import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/* 주제: EnvironmentMap */
// HDR파일 다운로드 : https://polyhaven.com/
// HDR to cubeMap 변환 : https://matheowis.github.io/HDRI-to-CubeMap/

export default function example() {
  /* 텍스쳐 이미지 로드 */
  const cubeTextureLoader = new THREE.CubeTextureLoader();
  const envTex = cubeTextureLoader.setPath("/textures/cubemap/").load([
    // 파일명 순서대로 넣기
    // X-Y-Z 순으로 넣는다.
    // 플러스(+) - 마이너스(-) 순으로 넣는다.
    // 파일명의 p는 Positive 플러스(+),  n은 Negative 마이너스(-)를 의미한다.
    "px.png",
    "nx.png",
    "py.png",
    "ny.png",
    "pz.png",
    "nz.png"
  ]);

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
  scene.background = envTex; // 장면 배경과 물체의 Environment Map 설정

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
  const ambientLight = new THREE.AmbientLight("white", 0.5);
  const directionalLight = new THREE.DirectionalLight("white", 1);
  directionalLight.position.set(1, 1, 2);
  scene.add(ambientLight, directionalLight);

  /* Controls 만들기 */
  new OrbitControls(camera, renderer.domElement);

  /* Messh 만들기 */
  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const material = new THREE.MeshBasicMaterial({
    // const material = new THREE.MeshStandardMaterial({
    // MeshStandardMaterial을 사용할 때 옵션인 metalness, roughness를 조절하기
    // metalness: 0.9, // 메탈릭 속성 증가로 반사 효과 극대화
    // roughness: 0.1, // 거칠기 감소로 표면 반사 강화
    envMap: envTex
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  /* 그리기 */
  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();

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
