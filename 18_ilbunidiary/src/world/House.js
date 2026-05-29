export class House {
  constructor(info) {
    this.visible = false;

    info.gltfLoader.load(info.modelSrc, (glb) => {
      // GLB의 첫 mesh 사용
      this.modelMesh = glb.scene.children[0];

      // 그림자 설정
      this.modelMesh.castShadow = true;

      // 위치 세팅
      this.modelMesh.position.set(info.x, info.y, info.z);

      // 씬 추가
      info.scene.add(this.modelMesh);
    });
  }
}
