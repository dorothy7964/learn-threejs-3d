import { Scene } from "three";

// 실제 동작하는 엔진 데이터
// 씬 + 물리 + 로더 상태 묶음
export const worldContext = {
  canvas: document.querySelector("#three-canvas"),
  scene: new Scene()
};

// 디자인 + 상태값
export const sceneConfig = {
  step: 0,
  backgroundColor: "#3e1322",
  lightColor: "#ffe9ac",
  lightOffColor: "#222",
  floorColor: "#111",
  pillarColor: "#071d28",
  barColor: "#441c1d",
  glassColor: "#9fdfff"
};
