import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PreventDragClick } from "./preventDragClick";

/* 주제: 드래그 클릭 방지 모듈로 만들기 */

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
  camera.position.set(5, 1.5, 4);
  scene.add(camera);

  /* Light 만들기 */
  const ambientLight = new THREE.AmbientLight("white", 0.5);
  scene.add(ambientLight); // AmbientLight : 전체적으로 은은하게 깔아주는 조명

  const directionalLight = new THREE.DirectionalLight("white", 0.5);
  directionalLight.position.set(1, 0, 2);
  scene.add(directionalLight); // DirectionalLight : 태양광 같은 조명

  /* Controls 만들기 */
  new OrbitControls(camera, renderer.domElement);

  /* Mesh 만들기  */
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const boxMaterial = new THREE.MeshStandardMaterial({ color: "plum" });
  const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
  boxMesh.name = "box";

  const torusGeometry = new THREE.TorusGeometry(2, 0.5, 16, 100);
  const torusMaterial = new THREE.MeshStandardMaterial({ color: "lime" });
  const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
  torusMesh.name = "torus";
  scene.add(boxMesh, torusMesh);

  const meshes = [boxMesh, torusMesh];

  /* 광선 만들기 */
  const raycaster = new THREE.Raycaster();

  /* 2D 화면상의 마우스 위치 만들기 */
  const mouse = new THREE.Vector2();

  /* 그리기 */
  const clock = new THREE.Clock();

  function draw() {
    const time = clock.getElapsedTime();

    // boxMesh.position.y = Math.sin(time) * 2;
    // torusMesh.position.y = Math.cos(time) * 2;

    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }

  // 객체 초기화 시 원래 색상을 저장
  for (const mesh of meshes) {
    mesh.originalColor = mesh.material.color.clone();
  }

  function checkIntersects() {
    if (preventDragClick.mouseDragMoved) return; // 드래그 시 클릭 이벤트 실행하지 않음

    // 카메라와 마우스 위치를 사용해 Raycaster 업데이트
    raycaster.setFromCamera(mouse, camera);

    // 마우스 위치와 교차하는 객체 확인
    const intersects = raycaster.intersectObjects(meshes);
    for (const item of intersects) {
      // 색상이 이미 빨간색인지 확인
      if (item.object.material.color.equals(new THREE.Color("red"))) {
        // 빨간색이면 원래 색상으로 변경
        item.object.material.color.copy(item.object.originalColor);
      } else {
        // 원래 색상이면 빨간색으로 변경
        item.object.material.color.set("red");
      }
      break; // 첫 번째 교차한 객체만 처리
    }
  }

  function setSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  /* 이벤트 */
  window.addEventListener("resize", setSize);
  canvas.addEventListener("click", (e) => {
    // threejs에 맞게 3차원 좌표로 변환
    mouse.x = (e.clientX / canvas.clientWidth) * 2 - 1; // 실제 클릭한 X의 위치 : e.clientX
    mouse.y = -((e.clientY / canvas.clientHeight) * 2 - 1); // 실제 클릭한 Y의 위치 : e.clientY

    checkIntersects();
  });

  // 마우스 드래그 클릭 방지 모듈 사용하기
  const preventDragClick = new PreventDragClick(canvas);

  draw();
}
