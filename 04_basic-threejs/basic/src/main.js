import * as THREE from "three";

// console.log("📢 THREE", THREE);

// renderer 만들기 :  renderer가 화면에 그림을 그려주는 역할을 한다.
const renderer = new THREE.WebGLRenderer();

// 풀스크린 사이즈 만들기 (브라우저 창 사이즈)
renderer.setSize(window.innerWidth, window.innerHeight);

// renderer가 가진 dom 요소인 캔버스를 화면에 조립해서 보여주면 된다.
console.log("📢 [renderer의 캔버스 사이즈 확인]", renderer.domElement);

// document.body에 조립하기
document.body.appendChild(renderer.domElement);
