import * as THREE from "three";
import dat from "dat.gui";

/* 주제: 위치 이동 (position) */

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

  /* Messh 만들기 */
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({
    color: "seagreen"
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  /* AxesHelper 만들기 */
  const axesHelper = new THREE.AxesHelper(3);
  scene.add(axesHelper);

  /* Dat GUI 만들기 */
  const gui = new dat.GUI();
  gui.add(camera.position, "x", -5, 5, 0.1).name("카메라 X");
  gui.add(camera.position, "y", -5, 5, 0.1).name("카메라 Y");
  gui.add(camera.position, "z", 2, 10, 0.1).name("카메라 Z");

  /* 그리기 */
  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();

    // mesh.position.y = 2;
    mesh.position.set(-1, 0, 0);

    // console.log( mesh.position.length() );
    // console.log( mesh.position.distanceTo(new THREE.Vector3(1, 2, 0)) );
    // console.log( mesh.position.distanceTo(camera.position) );

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
