import * as THREE from "three";

/* 주제: 빛(조명) 설정하기 */

export default function example() {
  /* Renderer 만들기 : html에 캔버스 미리 만들기 */
  const canvas = document.querySelector("#three-canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
    // alpha: true // 배경 투명도 설정
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  /* 디바이스 픽셀 비율을 설정 */
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  /*  배경색, 투명화 설정 */
  // renderer.setClearAlpha(0.5); // 불투명도 설정
  // renderer.setClearColor(0x00ff00);

  /*  Scene 만들기 */
  const scene = new THREE.Scene();
  // scene.background = new THREE.Color("blue");

  /* Camera 만들기 */
  const camera = new THREE.PerspectiveCamera(
    75, // 시야각 (field of view)
    window.innerWidth / window.innerHeight, // 종횡비(aspect)
    0.1, // near
    1000 // far
  );
  camera.position.x = 2;
  camera.position.y = 2;
  camera.position.z = 5;
  scene.add(camera);

  /* Light 만들기 */
  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.x = 2;
  light.position.z = 2;
  scene.add(light);

  /* Messh 만들기 */
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({
    // MeshBasicMaterial는 빛의 영향을 받지 않아 조명이 없어도 보인다.
    // MeshStandardMaterial는 빛의 영향을 받는다.
    color: "red"
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  /* 그리기 */
  renderer.render(scene, camera);

  function setSize() {
    // 카메라
    camera.aspect = window.innerWidth / window.innerHeight; // window는 전역 객쳐여서 작성하지 않아도 됨. window.innerWidth === innerWidth
    // updateProjectionMatrix -  카메라 투영에 관련된 값에 변화가 있을 경우 실행해야 함
    camera.updateProjectionMatrix();
    // setSize - 변화된 것을 다시 그려주는 것까지 해야 작동된다.
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  /* 이벤트 */
  window.addEventListener("resize", setSize);
}
