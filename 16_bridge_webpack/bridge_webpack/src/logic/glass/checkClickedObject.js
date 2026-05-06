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
export function handleFail(actions, sideLights) {
  // 잠시 후 실패 상태로 전환 (낙하 연출 시작)
  const timerId = setTimeout(() => {
    sceneConfig.fail = true; // 실패 상태 변경

    // 실패 애니메이션 실행
    actions[0].stop();
    actions[1].play();

    // 징검다리 조명 OFF
    sideLights.forEach((sideLight) => sideLight.turnOff());

    // 리플레이(카메라 시점 전환) 실행
    handleReplay();

    clearTimeout(timerId);
  }, 700);
}

// 캐릭터 낙하 연출 + 카메라 시점 변경 후 초기화
function handleReplay() {
  const timerId2 = setTimeout(() => {
    sceneConfig.onReplay = true; // 리플레이 모드 ON (카메라 아래 시점 전환)

    // 리플레이 종료 (카메라 원래 시점 복귀)
    const timerId3 = setTimeout(() => {
      sceneConfig.onReplay = false;
      clearTimeout(timerId3);
    }, 3000);

    clearTimeout(timerId2);
  }, 2000);

  return timerId2;
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

// 클리어 처리, 마지막 점프 처리
export function jumpFinal(player) {
  // 도착 지점으로 이동
  jumpFinal;
  gsap.to(player.cannonBody.position, {
    duration: 1,
    x: 0,
    z: -14
  });

  // 점프 연출
  gsap.to(player.cannonBody.position, {
    duration: 0.4,
    y: 12
  });
}

// 점프 애니메이션 실행
export function playJumpAnimation(actions) {
  actions[2].stop(); // 시간을 0으로 초기화
  actions[2].play(); // 점프
}
