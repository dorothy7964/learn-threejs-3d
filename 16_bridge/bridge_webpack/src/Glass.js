import { Mesh } from "three";
import { geo, mat, worldContext, sounds } from "./common";
import { Stuff } from "./Stuff";

// 유리판(Glass) 클래스 (물리 + 3D 메쉬 함께 관리)
export class Glass extends Stuff {
  constructor(info) {
    super(info); // 부모(Stuff) 속성 초기화

    // 유리 타입 (일반, 강화)
    this.type = info.type;

    // 유리판 단계
    this.step = info.step;

    // 사용할 geometry, material 설정
    this.geometry = geo.glass;

    this.material = this.type === "normal" ? mat.normalGlass : mat.strongGlass;
    this.mass = this.type === "normal" ? 1 : 0;

    // geometry에서 크기 정보 가져오기 (물리 계산용)
    this.width = this.geometry.parameters.width;
    this.height = this.geometry.parameters.height;
    this.depth = this.geometry.parameters.depth;

    // Three.js 메쉬 생성
    this.mesh = new Mesh(this.geometry, this.material);

    // 메쉬 위치 설정
    this.mesh.position.set(this.x, this.y, this.z);

    // 그림자 설정
    this.mesh.castShadow = true; // 그림자 생성
    this.mesh.receiveShadow = true; // 그림자 받기

    this.mesh.name = this.name; // 객체 이름 식별용
    this.mesh.step = this.step; // 클릭된 mesh에서 step 식별용
    this.mesh.type = this.type; // 유리판 여부 등을

    // mesh에도 식별 정보를 복사해서 클릭/충돌 시 사용하기
    this.mesh.name = this.name; // 객체 이름 식별용
    this.mesh.step = this.step; // 현재 유리판 단계 식별용
    this.mesh.type = this.type; // 유리판 타입

    // 씬에 추가
    worldContext.scene.add(this.mesh);

    // 물리 바디 생성 (cannon-es)
    this.setCannonBody();

    // 유리 타입별 소리 적용
    const sound = sounds[this.type];

    // 생성된 cannonBody에 충돌 이벤트 등록
    this.cannonBody.addEventListener("collide", playSound);

    function playSound(e) {
      // 충돌했을 때의 충격 세기 계산
      const impact = e.contact.getImpactVelocityAlongNormal();
      if (impact > 5) {
        sound.currentTime = 0; // 연속 충돌 시 처음부터 다시 재생
        sound.play(); // 충돌 사운드 재생
      }
    }
  }
}
