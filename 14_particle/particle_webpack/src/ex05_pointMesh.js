import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/* 주제: 포인트 좌표에 메쉬 생성하기 */

export default function example() {
  /* Renderer 만들기 : html에 캔버스 미리 만들기 */
  const canvas = document.querySelector("#three-canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  // Scene
  const scene = new THREE.Scene();

  // Camera
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
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  /* Mesh 만들기 */
  const planeMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.3, 0.3),
    new THREE.MeshBasicMaterial({
      color: "red",
      side: THREE.DoubleSide // Mesh의 앞면(front)과 뒷면(back)을 둘 다 렌더링한다
    })
  );

  /* Points 만들기 */
  const sphereGeometry = new THREE.SphereGeometry(1, 8, 8); // SphereGeometry(radius, widthSegments, heightSegments)
  const positionArray = sphereGeometry.attributes.position.array; // Geometry 안에 있는 vertex 좌표 배열을 꺼내기

  // 구의 vertex 좌표 위치마다 Plane Mesh 생성
  let plane;
  for (let i = 0; i < positionArray.length; i += 3) {
    plane = planeMesh.clone(); // 기존 Plane Mesh 복사

    // vertex 좌표(x, y, z)를 Plane 위치로 설정
    plane.position.x = positionArray[i];
    plane.position.y = positionArray[i + 1];
    plane.position.z = positionArray[i + 2];

    plane.lookAt(0, 0, 0); // Plane이 구 중심(0,0,0)을 바라보도록 방향 설정

    scene.add(plane); // Plane이 구 중심(0,0,0)을 바라보도록 방향 설정
  }

  /* 그리기 */
  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();

    controls.update();

    renderer.render(scene, camera);
    window.requestAnimationFrame(draw);
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
