import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/* 주제: 로딩 매니저 (여러개의 텍스쳐 이미지) */

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
  // 주의 : webpack.config.js파일 CopyWebpackPlugin에서 textures의 경로 설정이 되었는지 체크하기
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
  const material = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    map: baseColorTex
    // map: ambientTex
    // map: normalTex
    // map: roughnessTex
    // map: heightTex
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
