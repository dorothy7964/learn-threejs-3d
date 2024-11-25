export class PreventDragClick {
  constructor(el) {
    // 드래그 클릭 방지
    this.mouseDragMoved; // 마우스를 드래그 여부 체크 (true/false)
    let clickStartX;
    let clickStartY;
    let clickStartTime; // 마우스 클릭 경과 시간

    el.addEventListener("mousedown", (e) => {
      // 처음 클릭한 위치 좌표
      clickStartX = e.clientX;
      clickStartY = e.clientY;
      // 마우스 클릭하면 경과 시간 시작
      clickStartTime = Date.now();
    });

    el.addEventListener("mouseup", (e) => {
      // 마우스를 클릭하는 위치와 마우스를 떼는 시점의 위치가 일정 거리 차이가 있다면 드래그 한 것으로 간주
      const xGap = Math.abs(e.clientX - clickStartX);
      const yGap = Math.abs(e.clientY - clickStartY);
      const timeGap = Date.now() - clickStartTime;

      const dragThreshold = 5; // 드래그로 간주할 최소 거리
      let dragThresholdTime = 500; // 드래그로 간주할 최소 시간 (단위: 밀리초) 0.5초
      if (
        xGap > dragThreshold ||
        yGap > dragThreshold ||
        timeGap > dragThresholdTime
      ) {
        // 드래그로 간주
        this.mouseDragMoved = true;
      } else {
        this.mouseDragMoved = false;
      }
    });
  }
}
