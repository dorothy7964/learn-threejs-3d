import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";

/* 주제: TrackballControls */

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
  camera.position.z = 7;
  scene.add(camera);

  /* Light 만들기 */
  const ambientLight = new THREE.AmbientLight("white", 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight("white", 1);
  directionalLight.position.x = 1;
  directionalLight.position.z = 2;
  scene.add(directionalLight);

  /* Controls 만들기 */
  const controls = new TrackballControls(camera, renderer.domElement); // 마우스를 이용해  3D 객체를 회전, 확대, 축소 가능
  controls.maxDistance = 20;
  controls.minDistance = 5;
  // controls.target.set(3, 3, 3);

  /* Messh 만들기 */
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  let mesh;
  let material;

  const minColorValue = 50; // RGB 값의 최소값
  const colorRange = 255 - minColorValue; // RGB 값의 범위 (최대값 - 최소값)
  for (let i = 0; i < 20; i++) {
    material = new THREE.MeshStandardMaterial({
      color: `rgb(
				${minColorValue + Math.floor(Math.random() * colorRange)},
				${minColorValue + Math.floor(Math.random() * colorRange)},
				${minColorValue + Math.floor(Math.random() * colorRange)}
			)`
    });

    // Mesh 무작위 위치 조정
    const range = 0.5;
    const positionRange = 5;
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = (Math.random() - range) * positionRange;
    mesh.position.y = (Math.random() - range) * positionRange;
    mesh.position.z = (Math.random() - range) * positionRange;
    scene.add(mesh);
  }

  /* 그리기 */
  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();

    // 매 번 반복 실행하는 draw함수에서 controls 업데이트 메서드를 매 번 실행해줘야 한다.
    controls.update();

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
