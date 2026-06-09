import gsap from "gsap";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Player } from "./characters/Player";
import { camera, cameraPosition } from "./core/camera";
import "./core/lights";
import { canvas, renderer } from "./core/renderer";
import { scene } from "./core/scene";
import { InputController } from "./systems/InputController";
import { Floor } from "./world/Floor";
import { House } from "./world/House";
import { PointerMesh } from "./world/PointerMesh";
import { SpotMesh } from "./world/SpotMesh";

/* 전체 연결 + 게임 루프 */

// ===== 기본 세팅 =====
const gltfLoader = new GLTFLoader();
const raycaster = new THREE.Raycaster();

const meshes = []; // raycast 대상들
const mouse = new THREE.Vector2();
const destination = new THREE.Vector3();

// ===== Mesh =====
const pointerMesh = new PointerMesh(scene);
const spotMesh = new SpotMesh(scene, 5, 5);

// ===== floor =====
new Floor(scene, meshes);

// ===== Player =====
const player = new Player({
  scene,
  meshes,
  gltfLoader,
  modelSrc: "/models/ilbuni.glb"
});

// ===== House =====
const house = new House({
  gltfLoader,
  scene,
  modelSrc: "/models/house.glb",
  x: 5,
  y: -1.3,
  z: 2
});

// ===== Input =====
new InputController(canvas, (mouseData) => {
  mouse.x = mouseData.x;
  mouse.y = mouseData.y;

  raycasting(); // 클릭, 드래그 시 raycasting 실행
});

// ===== Raycast =====
function raycasting() {
  if (!player.modelMesh) return;

  raycaster.setFromCamera(mouse, camera);

  const hits = raycaster.intersectObjects(meshes);

  if (hits.length > 0) {
    destination.copy(hits[0].point);

    destination.y = 0.3;

    player.modelMesh.lookAt(destination); // 플레이어 방향 회전
    player.moving = true;

    pointerMesh.setPosition(destination); // 목적지 마커 이동
  }
}

// ===== LOOP =====
const timer = new THREE.Timer();

function animate() {
  timer.update();
  const delta = timer.getDelta();

  // animation mixer
  if (player.mixer) {
    player.mixer.update(delta);
  }

  // 플레이어 존재 시
  // 모델 로딩 전에 접근하면 오류가 발생하므로 존재 여부 체크
  if (player.modelMesh) {
    // 플레이어를 바라보도록 카메라 회전
    camera.lookAt(player.modelMesh.position);

    // ===============================
    // 이동 상태
    // ===============================
    if (player.moving) {
      // 목적지 방향 각도 계산
      const angle = Math.atan2(
        destination.z - player.modelMesh.position.z,
        destination.x - player.modelMesh.position.x
      );

      // X축 이동
      player.modelMesh.position.x += Math.cos(angle) * 0.05;

      // Z축 이동
      player.modelMesh.position.z += Math.sin(angle) * 0.05;

      // ===============================
      // 카메라 추적
      // 플레이어 위치 기준으로 카메라 이동
      // ===============================
      camera.position.x = cameraPosition.x + player.modelMesh.position.x;

      camera.position.z = cameraPosition.z + player.modelMesh.position.z;

      // ===============================
      // 걷기 애니메이션
      // ===============================
      player.actions[0].stop();
      player.actions[1].play();

      // ===============================
      // 목적지 도착 체크
      // ===============================
      if (
        Math.abs(destination.x - player.modelMesh.position.x) < 0.03 &&
        Math.abs(destination.z - player.modelMesh.position.z) < 0.03
      ) {
        player.moving = false;

        console.log("멈춤");
      }

      // ===============================
      // Spot 영역 진입 체크
      // ===============================
      if (
        Math.abs(spotMesh.mesh.position.x - player.modelMesh.position.x) <
          1.5 &&
        Math.abs(spotMesh.mesh.position.z - player.modelMesh.position.z) < 1.5
      ) {
        // 아직 집이 안 보이는 상태라면
        if (!house.visible) {
          console.log("나와");

          house.visible = true;

          // Spot 색상 변경
          spotMesh.setColor("seagreen");

          // 집 등장 애니메이션
          gsap.to(house.modelMesh.position, {
            duration: 1,
            y: 1,
            ease: "bounce.out"
          });

          // 카메라 내려오기
          gsap.to(camera.position, {
            duration: 1,
            y: 3
          });
        }
      } else if (house.visible) {
        // ===============================
        // Spot 영역 밖으로 나간 경우
        // ===============================
        console.log("들어가");

        house.visible = false;

        // Spot 색상 원래대로
        spotMesh.setColor("yellow");

        // 집 내려가기
        gsap.to(house.modelMesh.position, {
          duration: 0.5,
          y: -1.3
        });

        // 카메라 원래 위치 복귀
        gsap.to(camera.position, {
          duration: 1,
          y: 5
        });
      }
    } else {
      // ===============================
      // 가만히 서 있는 상태
      // ===============================
      player.actions[1].stop();
      player.actions[0].play();
    }
  }

  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}

function setSize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

// 이벤트
window.addEventListener("resize", setSize);

animate();
