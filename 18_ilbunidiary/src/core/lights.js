import * as THREE from "three";
import { scene } from "./scene.js";

// 환경광 (전체 밝기)
const ambientLight = new THREE.AmbientLight("white", 0.7);
scene.add(ambientLight);

// 방향광 (메인 그림자)
const directionalLight = new THREE.DirectionalLight("white", 3);
directionalLight.position.set(1, 1, 1);

directionalLight.castShadow = true;

// 그림자 퀄리티 설정
directionalLight.shadow.mapSize.set(2048, 2048);

// 그림자 범위
directionalLight.shadow.camera.left = -100;
directionalLight.shadow.camera.right = 100;
directionalLight.shadow.camera.top = 100;
directionalLight.shadow.camera.bottom = -100;
directionalLight.shadow.camera.near = -100;
directionalLight.shadow.camera.far = 100;

scene.add(directionalLight);
