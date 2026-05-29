import * as THREE from "three";

export class Floor {
  constructor(scene, meshes) {
    const textureLoader = new THREE.TextureLoader();

    const floorTexture = textureLoader.load("/images/grid.png");

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

    meshes.push(this.mesh);
  }
}
