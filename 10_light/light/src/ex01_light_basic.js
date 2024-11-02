import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import dat from "dat.gui";

/* 주제: Light 기본 + 애니메이션 */

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
  camera.position.set(0, 5, 9);
  scene.add(camera);

  /* Light 만들기 */
  // AmbientLight : 전체적으로 은은하게 깔아주는 조명
  const ambientLight = new THREE.AmbientLight("white", 0.5);
  scene.add(ambientLight);

  // DirectionalLight : 태양광 같은 조명
  const light = new THREE.DirectionalLight("red", 0.5);
  // light.position.x = -3;
  light.position.y = 3;
  scene.add(light);

  // lightHelper: 조명을 시각적으로 확인하는 법
  const lightHelper = new THREE.DirectionalLightHelper(light);
  scene.add(lightHelper);

  /* Controls 만들기 */
  new OrbitControls(camera, renderer.domElement);

  /* Geometry 만들기 */
  const planeGeometry = new THREE.PlaneGeometry(10, 10);
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const sphereGeometry = new THREE.SphereGeometry(0.7, 16, 16);

  /* Material 만들기 */
  const material1 = new THREE.MeshStandardMaterial({ color: "white" });
  const material2 = new THREE.MeshStandardMaterial({ color: "red" });
  const material3 = new THREE.MeshStandardMaterial({ color: "gold" });

  /* Mesh 만들기 : Geometry + Material */
  const plane = new THREE.Mesh(planeGeometry, material1); // 평면 바닥에 깔기
  const box = new THREE.Mesh(boxGeometry, material2);
  const sphere = new THREE.Mesh(sphereGeometry, material3);

  // PlaneGeometry
  // 기본적으로 평면 매쉬는 수직으로 되어있다.
  // 평면으로 사용하려면 위치를 조정해주면 된다.
  // Math.PI * 0.5: π의 절반 값으로, 이는 90도를 의미한다. X축을 기준으로 90도 회전
  plane.rotation.x = -Math.PI * 0.5;
  //box, sphere은 평면에 띄우기 위해 위치 조정
  box.position.set(1, 1, 0);
  sphere.position.set(-1, 1, 0);

  scene.add(plane, box, sphere);

  /* AxesHelper 만들기 : 3D 장면의 축을 시각화 */
  const axesHelper = new THREE.AxesHelper(3); // 빨간색(x축), 녹색(y축), 파란색(z축)으로 표시
  scene.add(axesHelper);

  /* Dat GUI 만들기 : 객체의 속성을 실시간으로 조정할 수 있는 인터페이스 */
  const gui = new dat.GUI();
  gui.add(light.position, "x", -5, 5).name("Light X");
  gui.add(light.position, "y", -5, 5).name("Light Y");
  gui.add(light.position, "z", -5, 10).name("Light Z");

  /* 그리기 */
  const clock = new THREE.Clock();

  function draw() {
    // 삼각함수 사용하여 반지름이 5인 원을 그리며 이동하기
    const time = clock.getElapsedTime();

    light.position.x = Math.cos(time) * 5;
    light.position.z = Math.sin(time) * 5;

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
