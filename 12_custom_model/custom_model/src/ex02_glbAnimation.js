import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

/* 주제: glb 애니메이션션 */

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
  new OrbitControls(camera, renderer.domElement);

  /* GLTF Loader: glf 파일 불러오기 */
  const gltfLoader = new GLTFLoader();
  let mixer; // 애니메이션

  gltfLoader.load(
    "/models/character.glb", // 파일 위치

    // GLTF 로드가 끝나면 실행하는 콜백 함수가 실행
    (gltf) => {
      // 만든 캐릭터 불러오기
      const characterMesh = gltf.scene.children[0];
      scene.add(characterMesh);

      // blender에서 만든 애니메이션 가져오기
      mixer = new THREE.AnimationMixer(characterMesh);
      const actions = [];
      const defaultAction = mixer.clipAction(gltf.animations[0]);
      const jumpAction = mixer.clipAction(gltf.animations[1]);
      actions[0] = defaultAction;
      actions[1] = jumpAction;

      // 애니메이션 옵션
      actions[0].repetitions = 2; // 반복 횟수 지정
      actions[0].clampWhenFinished = true; // 애니메이션이 끝났을 때 마지막 프레임에서 멈추도록 설정하는 속성

      actions[0].play();
      // actions[1].play();
    }
  );

  /* 그리기 */
  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);

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
