import gsap from "gsap";
import { sceneConfig } from "../../common";

export function canStepOnGlass(mesh) {
  // 유리 오브젝트가 아니면 무시
  if (!mesh.name.includes("glass")) return;

  // 점프 중이거나 실패 상태면 클릭 무시
  if (sceneConfig.jumping || sceneConfig.fail) return;

  // 현재 진행 순서의 유리판만 클릭 가능
  if (mesh.step - 1 !== sceneConfig.step) return false;

  return true;
}

// 일반 유리 밟았을 때 실패 처리
export function handleFail(actions) {
  // 잠시 후 떨어지도록 지연 처리
  setTimeout(() => {
    sceneConfig.fail = true; // 실패 상태 변경

    // 실패 애니메이션
    actions[0].stop();
    actions[1].play();
  }, 700);
}

// 캐릭터 위로 점프 후 앞으로 이동
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

// 점프 애니메이션 실행
export function playJumpAnimation(actions) {
  actions[2].stop(); // 시간을 0으로 초기화
  actions[2].play(); // 점프
}
