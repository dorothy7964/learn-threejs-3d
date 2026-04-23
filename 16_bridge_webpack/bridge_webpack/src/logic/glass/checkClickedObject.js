import gsap from "gsap";
import { sceneConfig } from "../../common";

// 클릭된 객체에 대한 처리 함수
export function canStepOnGlass(mesh) {
  // 유리 오브젝트가 아니면 무시
  if (!mesh.name.includes("glass")) return;

  // 현재 유리판을 밟아야 할 순서인지 확인
  if (mesh.step - 1 !== sceneConfig.step) return false;

  return true;
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
