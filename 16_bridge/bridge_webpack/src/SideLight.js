import { worldContext, sceneConfig, geo, mat } from "./common";
import { Mesh } from "three";

// 사이드 조명(작은 전구 같은 오브젝트) 클래스
export class SideLight {
  constructor(info) {
    // 컨테이너(씬). 없으면 기본 scene 사용
    const container = info.container || worldContext.scene;

    // 이름 (선택)
    this.name = info.name || "";

    // 위치 값 (기본값 0)
    this.x = info.x || 0;
    this.y = info.y || 0;
    this.z = info.z || 0;

    // geometry (구 형태 - 작은 전구 느낌)
    this.geometry = geo.sideLight;

    // material (빛 색상/재질)
    this.material = mat.sideLight;

    // Mesh 생성 (geometry + material 합침)
    this.mesh = new Mesh(this.geometry, this.material);

    // 위치 설정
    this.mesh.position.set(this.x, this.y, this.z);

    // scene(컨테이너)에 추가
    container.add(this.mesh);
  }

  // 조명 끄기 (색상을 꺼진 색으로 변경)
  turnOff() {
    this.mesh.material.color.set(sceneConfig.lightOffColor);
  }
}
