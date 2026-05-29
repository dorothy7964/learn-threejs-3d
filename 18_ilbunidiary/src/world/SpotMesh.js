import * as THREE from "three";

export class SpotMesh {
  constructor(scene, x = 0, z = 0) {
    this.mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(3, 3),
      new THREE.MeshStandardMaterial({
        color: "yellow",
        transparent: true,
        opacity: 0.5
      })
    );

    // 바닥에 눕히기
    this.mesh.rotation.x = -Math.PI / 2;

    // z-fighting 방지
    this.mesh.position.y = 0.005;

    // 위치 설정
    this.mesh.position.set(x, 0.005, z);

    this.mesh.receiveShadow = true;

    scene.add(this.mesh);
  }

  // 색 변경 함수
  setColor(color) {
    this.mesh.material.color.set(color);
  }
}
