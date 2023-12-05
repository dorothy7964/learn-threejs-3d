import * as THREE from "three";

export default function example() {
  /* Renderer 만들기 : html에 캔버스 미리 만들기 */
  const canvas = document.querySelector("#three-canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true // 부드러운 효과
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  /*  Scene 만들기 */
  const scene = new THREE.Scene();

  /*  Camera 만들기 */
  // const camera = new THREE.PerspectiveCamera(
  //   75, // 시야각 (field of view)
  //   window.innerWidth / window.innerHeight, // 종횡비(aspect)
  //   0.1, // near
  //   1000 // far
  // );
  // camera.position.x = 2;
  // camera.position.y = 2;
  // camera.position.z = 5;
  // scene.add(camera);

  /*  직교 카메라(Orthographic Camera) */
  const camera = new THREE.OrthographicCamera(
    -(window.innerWidth / window.innerHeight), // left
    window.innerWidth / window.innerHeight, // right
    1, // top
    -1, // bottom
    0.1, // near
    1000 // far
  );
  camera.position.x = 1;
  camera.position.y = 2;
  camera.position.z = 5;
  camera.lookAt(0, 0, 0); // 카메라가 도형의 원점 바라보게 하기
  camera.zoom = 0.5; // 기본값은 `1` 이다.
  camera.updateProjectionMatrix(); // 카메라 투영에 관련된 값에 변화가 있을 경우 실행해야 함

  /*  Messh 만들기 */
  const geometry = new THREE.BoxGeometry(1, 1, 1); // 직육면체 모양 만들기 BoxGeometry(1m, 1m, 1m)
  const material = new THREE.MeshBasicMaterial({
    // MeshBasicMaterial는 빛의 영향을 받지 않아 조명이 없어도 보인다.
    color: "red" // 재질의 색상
  });
  const mesh = new THREE.Mesh(geometry, material); // 재질 = geometry(모양) + Material(재질)
  scene.add(mesh); // 장면에 올리기

  renderer.render(scene, camera); // 그리기
}
