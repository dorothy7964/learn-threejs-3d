import gsap from "gsap";
import { sceneConfig } from "../../common";

// 클릭된 유리판 객체에 대한 처리 함수
export function canStepOnGlass(mesh) {
  // 유리 오브젝트가 아니면 무시
  if (!mesh.name.includes("glass")) return;

  // 점프 중이거나 이미 실패했으면 클릭 무시
  if (sceneConfig.jumping || sceneConfig.fail) return;

  // 현재 유리판을 밟아야 할 순서인지 확인
  if (mesh.step - 1 !== sceneConfig.step) return false;

  return true;
}

// 실패 처리 (일반 유리 밟았을 때)
export function handleFail() {
  //유리판 밟은 몇 초 후에 상태 변경
  setTimeout(() => {
    sceneConfig.fail = true; // 실패 상태 변경
  }, 700);
}

/* ===============================
  ========= 기능분리 =========
=============================== */

// 플레이어 위치 이동 (위 점프 + 앞으로 이동)
export function movePlayer(mesh, player, glassZ) {
  // 위로 점프
  gsap.to(player.cannonBody.position, {
    duration: 0.4,
    y: 12
  });

  // 앞으로 이동
  gsap.to(player.cannonBody.position, {
    duration: 1,
    x: mesh.position.x,
    z: glassZ[sceneConfig.step - 1]
  });
}
