import { Mesh } from "three";
import { geo, mat, worldContext } from "./common";
import { Stuff } from "./Stuff";

// 기둥(Pillar) 클래스 (물리 + 3D 메쉬 함께 관리)
export class Glass extends Stuff {
  constructor(info) {
    super(info); // 부모(Stuff) 속성 초기화

    // 유리 타입 (일반, 강화)
    this.type = info.type;

    // 사용할 geometry, material 설정
    this.geometry = geo.glass;

    this.material = this.type === "normal" ? mat.normalGlass : mat.strongGlass;
    this.mass = this.type === "normal" ? 1 : 0;

    // geometry에서 크기 정보 가져오기 (물리 계산용)
    // this.width = this.geometry.parameters.width;
    // this.height = this.geometry.parameters.height;
    // this.depth = this.geometry.parameters.depth;

    // Three.js 메쉬 생성
    this.mesh = new Mesh(this.geometry, this.material);

    // 메쉬 위치 설정
    this.mesh.position.set(this.x, this.y, this.z);

    // 그림자 설정
    this.mesh.castShadow = true; // 그림자 생성
    this.mesh.receiveShadow = true; // 그림자 받기

    // 씬에 추가
    worldContext.scene.add(this.mesh);

    // 물리 바디 생성 (cannon-es)
    this.setCannonBody();
  }
}
