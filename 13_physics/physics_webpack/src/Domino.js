import { Mesh, BoxGeometry, MeshBasicMaterial } from "three";
import { Body, Box, Vec3 } from "cannon-es";

// Domino 클래스 안에서 로더를 만들지 말고
// Domino를 사용하는 메인 파일에서 한 번만 생성하기
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export class Domino {
  constructor(info) {
    this.scene = info.scene;
    this.cannonWorld = info.cannonWorld;

    // Blender 만들어준 도미노 크기를 동일하게 기본값에 적기
    this.width = info.width || 0.6;
    this.height = info.height || 1;
    this.depth = info.depth || 0.2;

    // 도미노 위치
    this.x = info.x || 0;
    this.y = info.y || 0.5; // 중심 기준 좌표 → 바닥 위에 놓으려면 높이/2 만큼 올려야 함
    this.z = info.z || 0;

    // 도미노 회전값
    this.rotationY = info.rotationY || 0;

    // 도미노 glb 로드하기
    info.gltfLoader.load("/models/domino.glb", (glb) => {
      this.modelMesh = glb.scene.children[0]; // 로드한 glb의 Mesh 접근
      this.modelMesh.castShadow = true; // 그림자
      this.modelMesh.position.set(this.x, this.y, this.z); // 도미노 위치
      this.scene.add(this.modelMesh);

      this.setCannonBody(); // 렌더링용 모델과 물리엔진 바디를 연결하기 위한 물리 바디 생성 함수
    });
  }

  setCannonBody() {
    // 충돌 박스 형태 생성 (half extents 사용)
    const shape = new Box(
      // Vec3를 사용: 박스의 크기를 3D로 전달
      // 물리엔진은 중심 기준으로 충돌을 계산하므로 전체 크기의 절반을 전달
      new Vec3(this.width / 2, this.height / 2, this.depth / 2)
    );

    // 물리 바디 생성 및 속성 설정 (질량, 위치, 충돌 형태)
    this.cannonBody = new Body({
      mass: 1, // 무게 (중력 영향)
      position: new Vec3(this.x, this.y, this.z), // 위치
      shape // 충돌 형태
    });

    // Y축 기준 회전 적용
    this.cannonBody.quaternion.setFromAxisAngle(
      // cannonJs 회전은 quaternion
      new Vec3(0, 1, 0), // y축
      this.rotationY // Three.js rotationY와 동기화
    );

    // Three.js 메쉬 ↔ Cannon 바디 연결
    this.modelMesh.cannonBody = this.cannonBody; // 충돌 시 어떤 모델인지 알기 위해

    // this.물리 월드에 추가
    this.cannonWorld.addBody(this.cannonBody); //중력, 충돌 적용
  }
}
