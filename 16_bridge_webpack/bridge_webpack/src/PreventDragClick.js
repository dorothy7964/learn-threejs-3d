export class PreventDragClick {
  constructor(elem) {
    // 드래그 여부 저장
    this.mouseMoved;

    // 클릭 시작 위치와 시간 저장 변수
    let clickStartX;
    let clickStartY;
    let clickStartTime;

    // 마우스를 누른 순간
    elem.addEventListener("mousedown", (e) => {
      // 시작 좌표 저장
      clickStartX = e.clientX;
      clickStartY = e.clientY;

      // 클릭 시작 시간 저장
      clickStartTime = Date.now();
    });

    // 마우스를 뗀 순간
    elem.addEventListener("mouseup", (e) => {
      // 시작 위치와 끝 위치 차이 계산
      const xGap = Math.abs(e.clientX - clickStartX);
      const yGap = Math.abs(e.clientY - clickStartY);

      // 클릭 유지 시간 계산
      const timeGap = Date.now() - clickStartTime;

      // 일정 거리 이상 움직였거나
      // 오래 누르고 있었으면 드래그로 판단
      if (xGap > 5 || yGap > 5 || timeGap > 500) {
        this.mouseMoved = true;
      } else {
        // 거의 움직이지 않았으면 클릭으로 판단
        this.mouseMoved = false;
      }
    });
  }
}
