import { AnimationMixer } from "three";

export class Player {
  constructor(info) {
    this.moving = false;

    info.gltfLoader.load(info.modelSrc, (glb) => {
      // 모든 mesh에 그림자 적용
      glb.scene.traverse((child) => {
        if (child.isMesh) child.castShadow = true;
      });

      // 메인 mesh
      this.modelMesh = glb.scene.children[0];
      this.modelMesh.position.y = 0.3;
      this.modelMesh.name = "player";

      info.scene.add(this.modelMesh);
      info.meshes.push(this.modelMesh);

      // 애니메이션 믹서 생성
      this.mixer = new AnimationMixer(this.modelMesh);

      // 걷기 / 대기 애니메이션
      this.actions = [
        this.mixer.clipAction(glb.animations[0]),
        this.mixer.clipAction(glb.animations[1])
      ];

      this.actions[0].play();
    });
  }
}
