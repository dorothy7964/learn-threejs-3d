import { AnimationMixer } from "three";
import { worldContext } from "./common";
import { Stuff } from "./Stuff";

export class Player extends Stuff {
  constructor(info) {
    super(info);

    // 모델 로드 실행
    this.loadModel();
  }

  // 모델 로드 + 초기화
  loadModel() {
    worldContext.gltfLoader.load("/models/ilbuni.glb", (glb) => {
      // shadow
      glb.scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
        }
      });

      // ===== 실제 사용할 모델 =====
      // glb.scene은 그룹(껍데기)라서 내부 mesh를 꺼내 사용
      this.modelMesh = glb.scene.children[0];

      // 위치 & 회전 초기화
      this.modelMesh.position.set(this.x, this.y, this.z);
      this.modelMesh.rotation.set(
        this.rotationX,
        this.rotationY,
        this.rotationZ
      );

      worldContext.scene.add(this.modelMesh);

      // ===== 애니메이션 설정 =====
      this.setupAnimation(glb.animations);
    });
  }

  // ⚙️ 애니메이션 세팅
  setupAnimation(animations) {
    this.modelMesh.animations = animations;

    // mixer는 애니메이션 실행 엔진
    worldContext.mixer = new AnimationMixer(this.modelMesh);

    // 애니메이션 액션 배열
    this.actions = animations.map((clip) =>
      worldContext.mixer.clipAction(clip)
    );

    /* 인덱스 의미 */
    // 0: 기본 / 1: 떨어짐 / 2: 점프
    this.actions[2].repetitions = 1; // 점프 1번만 실행

    // 기본 애니메이션 시작
    this.actions[0].play();
  }
}
