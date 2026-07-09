import * as THREE from "three";

export class Floor {
  constructor(scene) {
    const textureLoader = new THREE.TextureLoader();
    const floorTexture = textureLoader.load("/images/grid.png");

    // 텍스처의 방향 반복(랩핑) 방식을 설정하는 속성
    // wrapS : 가로(X축, S축)
    // wrapT : 세로(Y축, T축)
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;

    floorTexture.repeat.x = 10;
    floorTexture.repeat.y = 10;

    this.mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100),
      new THREE.MeshStandardMaterial({
        map: floorTexture
      })
    );

    this.mesh.name = "floor";
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.receiveShadow = true;

    scene.add(this.mesh);
  }
}
