import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/* 주제: MeshPhongMaterial (MeshPhongMaterial과 비교) */

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
  scene.background = new THREE.Color('white');

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
	const ambientLight = new THREE.AmbientLight('white', 0.5);
	const directionalLight = new THREE.DirectionalLight('white', 1);
	directionalLight.position.set(1, 0, 2);
	scene.add(ambientLight, directionalLight);


  /* Controls 만들기 */
  new OrbitControls(camera, renderer.domElement);

  /* Messh 만들기 */
	const geometry = new THREE.SphereGeometry(1, 16, 16);



	// MeshPhongMaterial, 상대적으로 덜 사실적	
	const material1 = new THREE.MeshPhongMaterial({
		color: 'orangered',
		shininess: 800
	});

  // MeshStandardMaterial, 고품질의 사실적인 렌더링
  const material2 = new THREE.MeshStandardMaterial({
		color: 'orangered',
		roughness: 0.2,
		metalness: 0.3
	});
  
	const mesh1 = new THREE.Mesh(geometry, material1);
	const mesh2 = new THREE.Mesh(geometry, material2);
	mesh1.position.x = -1.5;
	mesh2.position.x = 1.5;
	scene.add(mesh1, mesh2);

  /* 그리기 */
  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();

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
