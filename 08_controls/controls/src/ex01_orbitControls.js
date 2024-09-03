import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/* 주제: OrbitControls */

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
  const controls = new OrbitControls(camera, renderer.domElement); // 마우스를 이용해  3D 객체를 회전, 확대, 축소 가능
  controls.enableDamping = true;

  // 줌 활성화 여부
  // controls.enableZoom = false;

  // 거리 설정
  // controls.maxDistance = 10;
  // controls.minDistance = 3;

  // 폴라 각도 설정
  // controls.minPolarAngle = Math.PI / 4; // 45도
  // controls.minPolarAngle = THREE.MathUtils.degToRad(45);
  // controls.maxPolarAngle = THREE.MathUtils.degToRad(135);

  // 목표 설정, 카메라가 바라볼 중심점을 설정
  // controls.target.set(2, 2, 2);

  // 카메라가 자동으로 회전할지 여부를 설정
  controls.autoRotate = true;

  // 카메라의 자동 회전 속도를 설정
  controls.autoRotateSpeed = 10;

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
