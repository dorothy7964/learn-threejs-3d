// 마우스 / 터치 입력 관리

export class InputController {
  constructor(canvas, onMove) {
    this.canvas = canvas;

    this.onMove = onMove;

    // 마우스를 누르고 있는 상태
    this.isPressed = false;

    // three.js용 마우스 좌표
    this.mouse = {
      x: 0,
      y: 0
    };

    this._bindEvents();
  }

  _bindEvents() {
    // ===============================
    // 마우스 클릭 시작
    // ===============================
    this.canvas.addEventListener("mousedown", (e) => {
      this.isPressed = true;

      this._setMouse(e);

      // 클릭 즉시 이동
      this.onMove(this.mouse);
    });

    // ===============================
    // 마우스 드래그
    // ===============================
    this.canvas.addEventListener("mousemove", (e) => {
      // 클릭 중이 아닐 경우 무시
      if (!this.isPressed) return;

      this._setMouse(e);

      // 드래그 중 목적지 계속 갱신
      this.onMove(this.mouse);
    });

    // ===============================
    // 마우스 클릭 종료
    // ===============================
    this.canvas.addEventListener("mouseup", () => {
      this.isPressed = false;
    });

    // ===============================
    // 터치 시작
    // ===============================
    this.canvas.addEventListener("touchstart", (e) => {
      this.isPressed = true;

      this._setMouse(e.touches[0]);

      this.onMove(this.mouse);
    });

    // ===============================
    // 터치 드래그
    // ===============================
    this.canvas.addEventListener("touchmove", (e) => {
      if (!this.isPressed) return;

      this._setMouse(e.touches[0]);

      this.onMove(this.mouse);
    });

    // ===============================
    // 터치 종료
    // ===============================
    this.canvas.addEventListener("touchend", () => {
      this.isPressed = false;
    });
  }

  // ===============================
  // 브라우저 좌표 → three.js 좌표 변환
  // ===============================
  _setMouse(e) {
    this.mouse.x = (e.clientX / this.canvas.clientWidth) * 2 - 1;

    this.mouse.y = -((e.clientY / this.canvas.clientHeight) * 2 - 1);
  }
}
