import * as THREE from "three";

/* 주제: 안개 */

export default function example() {
  /* Renderer 만들기 : html에 캔버스 미리 만들기 */
  const canvas = document.querySelector("#three-canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  /*  디바이스 픽셀 비율을 설정 */
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  /*  Scene 만들기 */
  const scene = new THREE.Scene();

  // 안개 만들기
  scene.fog = new THREE.Fog("black", 3, 7); // Fog( color : Integer, near : Float, far : Float )

  /*  Camera 만들기 */
  const camera = new THREE.PerspectiveCamera(
    75, // 시야각 (field of view)
    window.innerWidth / window.innerHeight, // 종횡비(aspect)
    0.1, // near
    1000 // far
  );
  camera.position.y = 1;
  camera.position.z = 5;
  scene.add(camera);

  /*  Light 만들기 */
  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.x = 1;
  light.position.y = 3;
  light.position.z = 5;
  scene.add(light);

  /*  Messh 만들기 */
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  // MeshBasicMaterial는 빛의 영향을 받지 않아 조명이 없어도 보인다.
  // MeshStandardMaterial는 빛의 영향을 받는다.
  const material = new THREE.MeshStandardMaterial({
    color: "red"
  });

  // Mesh 10개 만들기
  const meshes = [];
  let mesh;
  for (let i = 0; i < 10; i++) {
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = Math.random() * 5 - 2.5;
    mesh.position.z = Math.random() * 5 - 2.5;
    scene.add(mesh);
    meshes.push(mesh);
  }

  /*  그리기 */
  let time = Date.now();

  // 애니메이션 추가
  function draw() {
    const newTime = Date.now();
    const deltaTime = newTime - time;
    time = newTime;

    meshes.forEach((item) => {
      item.rotation.y += deltaTime * 0.001;
    });

    renderer.render(scene, camera);
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

  /*  이벤트 */
  window.addEventListener("resize", setSize);

  draw();
}
