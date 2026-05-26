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

    // Scene 안에 들어가는 Mesh 객체들을 저장하기 위한 공간
    this.meshes = [];
  }

  // 외부에서 전달받은 함수를 실행하는 메서드
  set(func) {
    func(); // main.js에서 넘겨준 함수 실행
  }

  render() {
    const renderer = this.renderer;
    const rect = this.elem.getBoundingClientRect(); // 현재 DOM 요소의 위치와 크기 정보 가져오기

    // 화면 밖에 있으면 렌더링하지 않음
    const isOffScreen =
      rect.bottom < 0 ||
      rect.top > renderer.domElement.clientHeight ||
      rect.right < 0 ||
      rect.left > renderer.domElement.clientWidth;

    if (isOffScreen) return;

    /* 화면 크기에 맞춰 Camera 비율 업데이트 */
    this.camera.aspect = rect.width / rect.height; // 화면(렌더링 영역) 크기에 맞게 카메라 비율(aspect) 다시 계산
    this.camera.updateProjectionMatrix(); // 변경된 aspect 값을 카메라에 실제 반영

    /* 화면에 보이는 영역 */
    const canvasBottom = renderer.domElement.clientHeight - rect.bottom; // 화면 전체 높이 - 요소의 bottom 위치
    renderer.setScissor(rect.left, canvasBottom, rect.width, rect.height); // 현재 DOM 영역만 렌더링되도록 영역 지정
    renderer.setViewport(rect.left, canvasBottom, rect.width, rect.height); // 렌더링이 출력될 화면 영역 설정
    renderer.setScissorTest(true); // setScissor로 지정한 영역만 렌더링하도록 활성화

    // 현재 Scene을 Camera 시점으로 렌더링
    renderer.render(this.scene, this.camera);
  }
}
