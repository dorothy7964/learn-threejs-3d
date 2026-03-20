import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ImagePanel } from "./ImagePanel";
import gsap from "gsap";

/* 주제: 형태가 바뀌는 이미지 패널 */
// 이미지 패널이 퍼졌다가 구 형태로 다시 모이는 애니메이션
// 이미지 패널들이 구 형태 → 이미지 클릭 시 랜덤으로 퍼짐 → 다시 구로 복원되는 인터랙션

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
  const planeGeometry = new THREE.PlaneGeometry(0.3, 0.3);
  const textureLoader = new THREE.TextureLoader();

  /* Points 만들기 */
  const sphereGeometry = new THREE.SphereGeometry(1, 8, 8); // SphereGeometry(radius, widthSegments, heightSegments)
  const spherePositionArray = sphereGeometry.attributes.position.array; // Geometry 안에 있는 vertex 좌표 배열을 꺼내기
  const randomPositionArray = []; // 랜덤 위치
  for (let i = 0; i < spherePositionArray.length; i++) {
    randomPositionArray.push((Math.random() - 0.5) * 10);
  }

  // 구의 vertex 좌표 위치마다 이미지 Plane Mesh 생성
  const imagePanels = [];

  let imagePanel;
  for (let i = 0; i < spherePositionArray.length; i += 3) {
    imagePanel = new ImagePanel({
      textureLoader,
      scene,
      geometry: planeGeometry,
      imageSrc: `/images/0${Math.ceil(Math.random() * 5)}.jpg`,
      x: spherePositionArray[i],
      y: spherePositionArray[i + 1],
      z: spherePositionArray[i + 2]
    });

    imagePanels.push(imagePanel);
  }

  /* 그리기 */
  const clock = new THREE.Timer();

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

  // 버튼 이벤트
  function setShape(e) {
    const btnType = e.target.dataset.type;
    let targetPositions;

    // 사용할 좌표 배열 선택
    switch (btnType) {
      case "random":
        targetPositions = randomPositionArray;
        break;
      case "sphere":
        targetPositions = spherePositionArray;
        break;
    }

    // gsap 사용, 객체의 속성을 부드럽게 애니메이션으로 변경
    for (let i = 0; i < imagePanels.length; i++) {
      // 위치 이동
      gsap.to(imagePanels[i].mesh.position, {
        duration: 2,
        x: targetPositions[i * 3],
        y: targetPositions[i * 3 + 1],
        z: targetPositions[i * 3 + 2]
      });

      // 랜덤 버튼 클릭 시 각도 일정하게 설정 = 회전 설정
      if (btnType === "random") {
        gsap.to(imagePanels[i].mesh.rotation, {
          duration: 2,
          x: 0,
          y: 0,
          z: 0
        });
      } else if (btnType === "sphere") {
        gsap.to(imagePanels[i].mesh.rotation, {
          duration: 2,
          x: imagePanels[i].sphereRotationX,
          y: imagePanels[i].sphereRotationY,
          z: imagePanels[i].sphereRotationZ
        });
      }
    }
  }

  /* 버튼 */
  const btnWrapper = document.createElement("div"); // 부모요소 추가 , 이벤트 위임하기
  btnWrapper.classList.add("btns");

  const randomBtn = document.createElement("button");
  randomBtn.dataset.type = "random";
  randomBtn.style.cssText = "position: absolute; left: 20px; top: 20px";
  randomBtn.innerHTML = "무작위";
  btnWrapper.append(randomBtn);

  const sphereBtn = document.createElement("button");
  sphereBtn.dataset.type = "sphere";
  sphereBtn.style.cssText = "position: absolute; left: 20px; top: 50px";
  sphereBtn.innerHTML = "구 모양";
  btnWrapper.append(sphereBtn);

  document.body.append(btnWrapper);

  /* 이벤트 */
  btnWrapper.addEventListener("click", setShape);
  window.addEventListener("resize", setSize);

  draw();
}
