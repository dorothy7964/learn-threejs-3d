/* IMPORT/ThreeJs */
import { BoxGeometry, MeshPhongMaterial, Scene, SphereGeometry } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

/* IMPORT/Cannon */
import { Material, World } from "cannon-es";

// 실제 동작하는 엔진 데이터
// 씬 + 물리 + 로더 상태 묶음
export const worldContext = {
  scene: new Scene(),
  gltfLoader: new GLTFLoader(),
  mixer: undefined,

  // cannon
  world: new World(),
  defaultMaterial: new Material("default"),
  glassMaterial: new Material("glass"),
  playerMaterial: new Material("player")
};

// 디자인 + 상태값
export const sceneConfig = {
  step: 0,
  fail: false, // 보통 유리판일 경우 떨어짐 = 실패 상태 여부
  jumping: false, // 점프 중인지 여부 (중복 클릭 방지)
  backgroundColor: "#3e1322",
  lightColor: "#ffe9ac",
  lightOffColor: "#222",
  floorColor: "#111",
  pillarColor: "#071d28",
  barColor: "#441c1d",
  glassColor: "#9fdfff"
};

// Geometry(모양)
export const geo = {
  floor: new BoxGeometry(200, 1, 200),
  pillar: new BoxGeometry(5, 10, 5),
  bar: new BoxGeometry(0.1, 0.3, 1.2 * 21), // 1.2 * 21 = 유리판 하나의 길이가 1.2이고, 그게 21개 이어진 전체 길이
  sideLight: new SphereGeometry(0.1, 6, 6),
  glass: new BoxGeometry(1.2, 0.05, 1.2)
};

// Material(재질)
export const mat = {
  floor: new MeshPhongMaterial({ color: sceneConfig.floorColor }),
  pillar: new MeshPhongMaterial({ color: sceneConfig.pillarColor }),
  bar: new MeshPhongMaterial({ color: sceneConfig.barColor }),
  sideLight: new MeshPhongMaterial({ color: sceneConfig.lightColor }),
  normalGlass: new MeshPhongMaterial({
    color: sceneConfig.glassColor,
    transparent: true,
    opacity: 0.1
  }),
  strongGlass: new MeshPhongMaterial({
    color: sceneConfig.glassColor,
    transparent: true,
    opacity: 0.5
  })
};
