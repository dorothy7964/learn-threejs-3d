import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/* 주제: 특정 방향의 광선(Ray)에 맞은 Mesh 판별하기 */

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

  /* Mesh 만들기 : Geometry를 이용해 광선을 시각적으로 보기 */
  // 선의 시작점과 끝점을 정의
  const lineMaterial = new THREE.LineBasicMaterial({ color: "yellow" });
  const points = [];
  points.push(new THREE.Vector3(0, 0, 100)); // 모니터 바깥 방향 (화면에서 앞쪽)
  points.push(new THREE.Vector3(0, 0, -100)); // 모니터 안쪽 방향 (화면에서 뒤쪽)

  // 정해진 두 점을 잇는 형태
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

  // 광선의 위치를 시각화 하기
  const guide = new THREE.Line(lineGeometry, lineMaterial);
  scene.add(guide);

  // 광선에 맞을 물체 생성
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const boxMaterial = new THREE.MeshStandardMaterial({ color: "plum" });
  const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
  boxMesh.name = "box";

  const torusGeometry = new THREE.TorusGeometry(2, 0.5, 16, 100);
  const torusMaterial = new THREE.MeshStandardMaterial({ color: "lime" });
  const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
  torusMesh.name = "torus";
  scene.add(boxMesh, torusMesh);

  const meshes = [boxMesh, torusMesh]; // 물체를 움직이게 하면서 광선에 맞았는지 체크할 때 배열에 넣어놔야 한 번에 체크하기가 편하다.

  /* Raycaster 만들기 */
  const raycaster = new THREE.Raycaster();

  /* 그리기 */
  const clock = new THREE.Clock();

  function draw() {
    const time = clock.getElapsedTime();

    boxMesh.position.y = Math.sin(time) * 2;
    torusMesh.position.y = Math.cos(time) * 2;

    // 기본 색상 설정, 광선이 관통하지 않았을 때
    boxMesh.material.color.set("plum");
    torusMesh.material.color.set("lime");

    /* Raycaster 세팅 */
    const origin = new THREE.Vector3(0, 0, 100); // 광선을 쏘는 출발점
    const direction = new THREE.Vector3(0, 0, -100); // 광선을 쏘는 뱡향
    direction.normalize(); // 정규화된 벡터로 변환해주는 함수
    // console.log(direction.length()); // 1 , / const direction = new THREE.Vector3(0, 0, -1);과 동일한 코드가 된다.

    raycaster.set(origin, direction);

    // 특정 광선을 지나는 Mesh 체크하기
    const intersects = raycaster.intersectObjects(meshes);
    intersects.forEach((item) => {
      // 광선이 관통하면 색상이 변경되도록 설정
      item.object.material.color.set("red");
    });

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
