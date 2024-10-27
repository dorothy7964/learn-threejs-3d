import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/* 주제: MeshStandardMaterial에 효과 더하기 */

export default function example() {
  /* 로딩 매니저 */
  const loadingManager = new THREE.LoadingManager();
  loadingManager.onStart = () => {
    console.log("로드 시작");
  };
  loadingManager.onProgress = (img) => {
    console.log(img + " 로드");
  };
  loadingManager.onLoad = () => {
    console.log("로드 완료");
  };
  loadingManager.onError = () => {
    console.log("에러");
  };

  /* 텍스쳐 이미지 로드 */
  const textureLoader = new THREE.TextureLoader(loadingManager);
  const baseColorTex = textureLoader.load(
    "/textures/fabric/Fabric_Weave_001_basecolor.png"
  );
  const ambientTex = textureLoader.load(
    "/textures/fabric/Fabric_Weave_001_ambientOcclusion.png"
  );
  const normalTex = textureLoader.load(
    "/textures/fabric/Fabric_Weave_001_normal.png"
  );
  const roughnessTex = textureLoader.load(
    "/textures/fabric/Fabric_Weave_001_roughness.png"
  );
  const heightTex = textureLoader.load(
    "/textures/fabric/Fabric_Weave_001_height.png"
  );

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
  scene.background = new THREE.Color("white");

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
  // const material = new THREE.MeshBasicMaterial({
  const material = new THREE.MeshStandardMaterial({
    map: baseColorTex,
    roughness: 0.3, // 거칠기
    metalness: 0.2, // 금속성을 설정
    normalMap: normalTex, // 표면의 미세한 세부사항과 질감을 시뮬레이션
    roughnessMap: roughnessTex, // 특정 부분의 거칠기를 다르게 설정, 더욱 디테일한 조정이 가능
    aoMap: ambientTex, // 주변광이 차단되는 정도를 나타내며, 깊이와 입체감을 증가
    aoMapIntensity: 2, // 주변광 차단 맵의 강도
    color: "yellow" // 기본 색상을 설정
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
