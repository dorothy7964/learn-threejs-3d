import * as THREE from "three";
import dat from "dat.gui";

/* 주제: GUI 컨트롤 */

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

  camera.position.y = 1;
  camera.position.z = 5;
  scene.add(camera);

  /* Light 만들기 */
  const ambientLight = new THREE.AmbientLight("white", 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight("white", 1);
  directionalLight.position.x = 1;
  directionalLight.position.z = 2;
  scene.add(directionalLight);

  /* Messh 만들기 */
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({
    color: "seagreen"
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  /* Dat GUI 만들기 */
  const gui = new dat.GUI();
  // 자바스크립트 오브젝트의 속성 값을 그래픽 기반의 UI로 조정할 수 있다.
  // gui.add(자바스크립트 오브젝트, "속성", 범위 최소값, 범위 최대값, 단계).name("레이블 이름");
  gui.add(mesh.position, "y", -5, 5, 0.01).name("큐브 Y");
  gui.add(camera.position, "x", -10, 10, 0.01).name("카메라 X");
  // gui
  // 	.add(mesh.position, 'z')
  // 	.min(-10)
  // 	.max(3)
  // 	.step(0.01)
  // 	.name('메쉬의 Z 위치');

  camera.lookAt(mesh.position);

  /* 그리기 */
  const clock = new THREE.Timer();

  function draw() {
    const time = clock.getElapsedTime();

    mesh.rotation.y = time;

    camera.lookAt(mesh.position);

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
