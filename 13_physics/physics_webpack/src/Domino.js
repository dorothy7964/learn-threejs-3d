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
    });
  }
}
