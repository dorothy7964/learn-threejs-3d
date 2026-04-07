import { worldContext } from "./common";
import { Box, Vec3, Body } from "cannon-es";

// 물리 객체(박스 등) 공통 클래스
export class Stuff {
  constructor(info = {}) {
    // 객체 이름
    this.name = info.name || "";

    // 위치 좌표
    this.x = info.x || 0;
    this.y = info.y || 0;
    this.z = info.z || 0;

    // 회전값 (라디안)
    this.rotationX = info.rotationX || 0;
    this.rotationY = info.rotationY || 0;
    this.rotationZ = info.rotationZ || 0;

    // 질량 (0이면 고정된 물체)
    this.mass = info.mass || 0;

    // 물리 재질 (마찰, 반발력 등)
    this.cannonMaterial = info.cannonMaterial || worldContext.defaultMaterial;
  }

  setCannonBody() {
    const material = this.cannonMaterial;

    // 박스 형태 물리 충돌체 생성 (크기의 절반값 사용)
    const shape = new Box(
      new Vec3(this.width / 2, this.height / 2, this.depth / 2)
    );

    // 물리 바디 생성
    this.cannonBody = new Body({
      mass: this.mass, // 질량
      position: new Vec3(this.x, this.y, this.z), // 위치
      shape, // 충돌 형태
      material // 재질
    });

    // Y축 기준 회전 적용
    this.cannonBody.quaternion.setFromAxisAngle(
      new Vec3(0, 1, 0),
      this.rotationY
    );

    // 물리 월드에 바디 추가
    worldContext.world.addBody(this.cannonBody);
  }
}
