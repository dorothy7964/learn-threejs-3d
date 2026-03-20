/* ===============================
	House 클래스
	- GLTF 모델을 로드해서 씬에 배치하는 객체
=============================== */
export class House {
  constructor(info) {
    /* -------------------------------
			1. 위치 및 높이 값 설정
    ------------------------------- */
    this.x = info.x; // X 좌표
    this.z = info.z; // Z 좌표
    this.height = info.height || 2; // 높이 (기본값 2)

    /* -------------------------------
			2. GLTF 모델 로드
			- modelSrc 경로의 .glb 파일을 불러옴
    ------------------------------- */
    info.gltfLoader.load(info.modelSrc, (glb) => {
      /* -------------------------------
				3. 모델 내부 Mesh 순회
				- 모든 메시에 그림자 생성 활성화
      ------------------------------- */
      glb.scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true; // 그림자 생성
        }
      });

      /* -------------------------------
				4. 모델 추출 및 위치 설정
      ------------------------------- */
      this.mesh = glb.scene.children[0]; // 로드된 모델 가져오기
      this.mesh.position.set(
        this.x, // X 위치
        this.height / 2, // 바닥에 맞추기 위해 높이 절반
        this.z // Z 위치
      );

      /* -------------------------------
				5. 씬에 추가
      ------------------------------- */
      info.scene.add(this.mesh); // Three.js 씬에 모델 추가
    });
  }
}
