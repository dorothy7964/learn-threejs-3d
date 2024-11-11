import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper";
import dat from "dat.gui";

/* 주제: RectAreaLight */

export default function example() {
  /* Renderer 만들기 : html에 캔버스 미리 만들기 */
  const canvas = document.querySelector("#three-canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  // 그림자 설정
  renderer.shadowMap.enabled = true;

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
  // RectAreaLight : 직사각형 모양으로 균일한 빛을 방사하는 조명
  const light = new THREE.RectAreaLight("orange", 10, 2, 2);
  light.position.set(0, 2, 3);
  scene.add(light);

  // lightHelper: 조명을 시각적으로 확인하는 법
  // RectAreaLightHelper는 three.js 코어에 기본적으로 포함되지 않았기 때문에 별도로 import 해줘야 한다.
  const lightHelper = new RectAreaLightHelper(light);
  scene.add(lightHelper);

  /* Controls 만들기 */
  new OrbitControls(camera, renderer.domElement);

  /* Geometry 만들기 */
  const planeGeometry = new THREE.PlaneGeometry(10, 10);
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const sphereGeometry = new THREE.SphereGeometry(0.7, 16, 16);

  /* Material 만들기 */
  const material1 = new THREE.MeshStandardMaterial({ color: "white" });
  const material2 = new THREE.MeshStandardMaterial({ color: "white" });
  const material3 = new THREE.MeshStandardMaterial({ color: "white" });

  /* Mesh 만들기 : Geometry + Material */
  const plane = new THREE.Mesh(planeGeometry, material1); // 평면 바닥에 깔기
  const box = new THREE.Mesh(boxGeometry, material2);
  const sphere = new THREE.Mesh(sphereGeometry, material3);

  plane.rotation.x = -Math.PI * 0.5;
  box.position.set(1, 1, 0);
  sphere.position.set(-1, 1, 0);

  // 물체에 그림자 설정
  // CastShadow : 물체에 그림자 생성 (카메라 범위, 받는 객체 receiveShadow 설정, 렌더러 설정)
  // Receive Shadow : 빛에 의해 투사된 다른 오브젝트의 그림자를 받을 수 있다.
  plane.receiveShadow = true;
  box.castShadow = true;
  box.receiveShadow = true;
  sphere.castShadow = true;
  sphere.receiveShadow = true;

  scene.add(plane, box, sphere);

  /* AxesHelper 만들기 : 3D 장면의 축을 시각화 */
  const axesHelper = new THREE.AxesHelper(3); // 빨간색(x축), 녹색(y축), 파란색(z축)으로 표시
  scene.add(axesHelper);

  /* Dat GUI 만들기 : 객체의 속성을 실시간으로 조정할 수 있는 인터페이스 */
  const gui = new dat.GUI();
  gui.add(light.position, "x", -5, 5).name("Light X");
  gui.add(light.position, "y", -5, 5).name("Light Y");
  gui.add(light.position, "z", -5, 5).name("Light Z");

  /* 그리기 */

  function draw() {
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
