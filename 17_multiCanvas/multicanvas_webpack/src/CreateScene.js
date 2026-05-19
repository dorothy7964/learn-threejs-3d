import { Scene, PerspectiveCamera, Color } from "three";

export class CreateScene {
  constructor(info) {
    this.renderer = info.renderer; // 외부에서 전달받은 renderer 저장
    this.elem = document.querySelector(info.placeholder); // Scene이 렌더링될 DOM 요소 선택
    const rect = this.elem.getBoundingClientRect(); // DOM 요소의 현재 위치와 크기 정보 가져오기

    // ======= 옵션 기본값 =======
    const bgColor = info.bgColor || "white"; // 배경색 기본값 설정

    const fov = info.fov || 75; // 카메라 시야각(FOV)
    const near = info.near || 0.1; // 카메라가 볼 수 있는 최소 거리
    const far = info.far || 100; // 카메라가 볼 수 있는 최대 거리
    const aspect = rect.width / rect.height; // 요소의 가로 / 세로 비율 계산
    const cameraPosition = info.cameraPosition || { x: 0, y: 0, z: 3 }; // 카메라 기본 위치 설정 (값이 없으면 z축 3 위치 사용)

    // ======= scene 생성 =======
    this.scene = new Scene();
    this.scene.background = new Color(bgColor);

    // ======= camera 생성 =======
    this.camera = new PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.x = cameraPosition.x;
    this.camera.position.y = cameraPosition.y;
    this.camera.position.z = cameraPosition.z;

    this.scene.add(this.camera);
  }
}
