import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { CreateScene } from "./CreateScene";
import "./main.css";

/* 주제: 주제: 여러개의 캔버스 사용하기 */

/* ===============================
  ======= Renderer =======
=============================== */
const canvas = document.querySelector("#three-canvas");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

// glTF(.gltf, .glb) 3D 모델 파일을 불러오기 위한 로더 생성
const gltfLoader = new GLTFLoader();

/* ===============================
	======= Scene 만들기 =======
=============================== */
// 	======= sceneA  =======
const sceneA = new CreateScene({
  renderer, // 공용 renderer 전달
  placeholder: ".canvas-placeholder.a", // Scene이 사용할 화면 영역 선택
  cameraPosition: { x: -1, y: 1, z: 2 }
});

sceneA.set(() => {
  // 조명 생성
  const light = new THREE.DirectionalLight("white", 1);
  light.position.set(-1, 2, 3);
  // sceneA.scene.add(light);

  // 카메라 설정
  sceneA.camera.add(light);
  sceneA.controls = new OrbitControls(sceneA.camera, sceneA.elem);

  // 형태 생성
  const geometry = new THREE.BoxGeometry(1, 1, 1);

  // 재질 생성
  const material = new THREE.MeshStandardMaterial({
    color: "green"
  });

  // 객체 생성
  const mesh = new THREE.Mesh(geometry, material);
  sceneA.meshes.push(mesh);
  sceneA.meshes.forEach((mesh) => {
    sceneA.scene.add(mesh);
  });
});

// 	======= sceneB  =======
const sceneB = new CreateScene({
  renderer, // 공용 renderer 전달
  placeholder: ".canvas-placeholder.b", // Scene이 사용할 화면 영역 선택
  cameraPosition: { x: -1, y: 1, z: 1 }
});

sceneB.set(() => {
  // 조명 생성
  const light = new THREE.DirectionalLight("white", 1);
  light.position.set(-1, 2, 3);
  // sceneB.scene.add(light);

  // 카메라 설정
  sceneB.camera.add(light);
  sceneB.controls = new OrbitControls(sceneB.camera, sceneB.elem);

  // 형태 생성
  const geometry = new THREE.BoxGeometry(0.4, 1, 0.7);

  // 재질 생성
  const material = new THREE.MeshStandardMaterial({
    color: "skyblue"
  });

  // 객체 생성
  const mesh = new THREE.Mesh(geometry, material);
  sceneB.meshes.push(mesh);
  sceneB.meshes.forEach((mesh) => {
    sceneB.scene.add(mesh);
  });
});

// 	======= sceneC  =======
const sceneC = new CreateScene({
  renderer, // 공용 renderer 전달
  placeholder: ".canvas-placeholder.c", // Scene이 사용할 화면 영역 선택
  cameraPosition: { x: -1, y: 1, z: 1 }
});

sceneC.set(() => {
  // 조명 생성
  const light = new THREE.DirectionalLight("white", 1);
  light.position.set(-1, 2, 3);
  // sceneC.scene.add(light);

  // 카메라 설정
  sceneC.camera.add(light);
  sceneC.controls = new OrbitControls(sceneC.camera, sceneC.elem);

  // glb 파일 불러오기
  gltfLoader.load("./models/ilbuni.glb", (glb) => {
    const mesh = glb.scene.children[0];
    sceneC.meshes.push(mesh);
    sceneC.scene.add(mesh);
  });
});

/* ===============================
  ======= 그리기 =======
=============================== */
const clock = new THREE.Clock();

function draw() {
  const delta = clock.getDelta();

  sceneA.meshes.forEach((mesh) => {
    mesh.rotation.y += delta;
  });
  sceneB.meshes.forEach((mesh) => {
    mesh.rotation.y += delta;
  });
  sceneC.meshes.forEach((mesh) => {
    mesh.rotation.y += delta;
  });

  // 현재 Scene 렌더링 실행
  // render() 내부에서 viewport, scissor 설정 후
  // 실제 화면에 객체를 그려줌
  sceneA.render();
  sceneB.render();
  sceneC.render();

  window.requestAnimationFrame(draw); // 다음 프레임 다시 실행
}

function setSize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
}

/* ===============================
	======= 이벤트 =======
=============================== */
window.addEventListener("resize", setSize);

draw();
