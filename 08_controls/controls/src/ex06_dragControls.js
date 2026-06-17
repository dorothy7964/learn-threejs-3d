import * as THREE from "three";
import { DragControls } from "three/examples/jsm/controls/DragControls";

/* 주제: DragControls */

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

  /* Messh 만들기 */
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  let mesh;
  let material;
  const meshes = []; // 씬에 드래그할 수 있는 오브젝트 추가

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
    mesh.name = `box-${i}`; // 각 box의 이름 지정
    scene.add(mesh);
    meshes.push(mesh);
  }

  /* Controls 만들기 */
  // 코드 위치 중요, meshes 배열이 정의된 후 작성해야 한다.
  const controls = new DragControls(meshes, camera, renderer.domElement);

  // 드래그 시작 시 호출되는 이벤트
  controls.addEventListener("dragstart", (e) => {
    console.log("드래그 시작", e.object.name);
    e.object.userData.originalColor = e.object.material.color.clone(); // 원래 색상 저장
    e.object.material.emissive.setRGB(0.5, 0.5, 0.5); // 드래그 시작하면 발광 색상 적용
  });

  // 드래그 종료 시 호출되는 이벤트
  controls.addEventListener("dragend", (e) => {
    console.log("드래그 종료", e.object.name);
    e.object.material.emissive.set(0x000000); // 발광 색상 초기화
    e.object.material.color.copy(e.object.userData.originalColor); // 원래 색상 복구
  });

  /* 그리기 */
  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();

    // DragControls에는 업데이트 메소드가 없다.

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
