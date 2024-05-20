import * as THREE from "three";

/* 주제: 애니메이션 성능 보정 (자바스크립트 내장 기능 이용) */

export default function example() {
  /* Renderer 만들기 : html에 캔버스 미리 만들기 */
  const canvas = document.querySelector("#three-canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  /* 디바이스 픽셀 비율을 설정 */
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  /*  Scene 만들기 */
  const scene = new THREE.Scene();

  /* Camera 만들기 */
  const camera = new THREE.PerspectiveCamera(
    75, // 시야각 (field of view)
    window.innerWidth / window.innerHeight, // 종횡비(aspect)
    0.1, // near
    1000 // far
  );
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

  /*  애니메이션 성능 보정 */
  let oldTime = Date.now();

  /* 그리기 */
  function draw() {
    // 애니메이션 추가

    const newTime = Date.now();
    const deltaTime = newTime - oldTime;
    oldTime = newTime;

    // 각도는 Radian을 사용
    // 360도는 2파이
    // mesh.rotation.y += 0.1;
    // mesh.rotation.y += THREE.MathUtils.degToRad(1);
    mesh.rotation.y += deltaTime * 0.005;
    mesh.position.y += deltaTime * 0.001;

    if (mesh.position.y > 3) {
      mesh.position.y = 0;
    }

    renderer.render(scene, camera);

    // window.requestAnimationFrame(draw);
    renderer.setAnimationLoop(draw);
  }

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

  draw();
}
