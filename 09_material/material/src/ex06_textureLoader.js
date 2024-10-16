import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/* 주제: 텍스쳐 이미지 로드하기 */

const onLoad = () => {
  console.log("로드 완료");
};

const onProgress = () => {
  console.log("로드 중");
};

const onError = () => {
  console.log("로드 에러");
};

export default function example() {
  /* 텍스쳐 이미지 로드 */
  // 주의 : webpack.config.js파일 CopyWebpackPlugin에서 textures의 경로 설정이 되었는지 체크하기
  const textureLoader = new THREE.TextureLoader();
  const frontTexture = textureLoader.load(
    "/textures/watermelon/Watermelon_001_basecolor.jpg",
    onLoad, // 로드 완료 시 호출
    onProgress, // 로드 중일 때 호출
    onError // 로드 에러 시 호출
  );
  const backTexture = textureLoader.load(
    "/textures/watermelon/Watermelon_001_roughness.jpg",
    onLoad, // 로드 완료 시 호출
    onProgress, // 로드 중일 때 호출
    onError // 로드 에러 시 호출
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

  // MeshBasicMaterial는 조명이나 그림자의 영향을 받지 않는다.
  // material 배열 생성, 앞면과 뒷면에 다른 텍스처 적용

  // 외부 면
  const frontMaterial = new THREE.MeshStandardMaterial({ map: frontTexture });
  const outsideMaterials = [
    frontMaterial, // 오른쪽 면 (x+)
    frontMaterial, // 왼쪽 면 (x-)
    frontMaterial, // 위쪽 면 (y+)
    frontMaterial, // 아래쪽 면 (y-)
    frontMaterial, // 앞면 (z+)
    frontMaterial // 뒷면 (z-)
  ];

  // 내부 면
  const backMaterial = new THREE.MeshStandardMaterial({
    // map: backTexture,
    color: "red",
    side: THREE.BackSide
  });
  const insideMaterials = [
    backMaterial, // 오른쪽 면 (x+)
    backMaterial, // 왼쪽 면 (x-)
    backMaterial, // 위쪽 면 (y+)
    backMaterial, // 아래쪽 면 (y-)
    backMaterial, // 앞면 (z+)
    backMaterial // 뒷면 (z-)
  ];

  // 두 개의 정육면체를 생성
  const outsideMesh = new THREE.Mesh(geometry, outsideMaterials);
  const insideMesh = new THREE.Mesh(geometry, insideMaterials);

  // 두 정육면체를 씬에 추가
  scene.add(outsideMesh);
  scene.add(insideMesh);

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
