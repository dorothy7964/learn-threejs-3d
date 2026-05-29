import * as THREE from "three";

export class PointerMesh {
  constructor(scene) {
    this.mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({
        color: "crimson",
        transparent: true,
        opacity: 0.5
      })
    );

    // 바닥 방향으로 눕히기
    this.mesh.rotation.x = -Math.PI / 2;

    // z-fighting 방지
    this.mesh.position.y = 0.01;

    scene.add(this.mesh);
  }

  setPosition(position) {
    this.mesh.position.x = position.x;
    this.mesh.position.z = position.z;
  }
}
