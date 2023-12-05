import * as THREE from "three";

/* 1. Renderer 만들기 : 동적으로 캔버스 조합하기 */
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// console.log("📢 [renderer의 캔버스 사이즈 확인]", renderer.domElement);
// document.body.appendChild(renderer.domElement);

/* 2. Renderer 만들기 : html에 캔버스 미리 만들기 */
const canvas = document.querySelector("#three-canvas");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true // 부드러운 효과
});
renderer.setSize(window.innerWidth, window.innerHeight);

/** 
 * 
 * 
** [설명] 1. Renderer 만들기 : 동적으로 캔버스 조합하기 
// console.log("📢 THREE", THREE);

// renderer 만들기 :  renderer가 화면에 그림을 그려주는 역할을 한다.
const renderer = new THREE.WebGLRenderer();

// 풀스크린 사이즈 만들기 (브라우저 창 사이즈)
renderer.setSize(window.innerWidth, window.innerHeight);

// renderer가 가진 dom 요소인 캔버스를 화면에 조립해서 보여주면 된다.
console.log("📢 [renderer의 캔버스 사이즈 확인]", renderer.domElement);

// document.body에 조립하기
document.body.appendChild(renderer.domElement);
 * 
 * 
 ** [설명] 2. Renderer 만들기 : html에 캔버스 미리 만들기
 // html의 캔버스 태그 가져오기
const canvas = document.querySelector("#three-canvas");

// 랜더러를 만들고 캔버스의 속성의 값을 캔버스로 지정하주기 { canvas : canvas } = { canvas }
const renderer = new THREE.WebGLRenderer({ canvas });

// 랜더러 사이즈를 브라우저 사이즈로 맞추기
renderer.setSize(window.innerWidth, window.innerHeight);

// document.body.appendChild는 하지 않아도 됨 이미 html에 캔버스 태그를 만들어 놨기 때문;
 * 
 * 
*/

/*  Scene 만들기 */
const scene = new THREE.Scene();

/*  Camera 만들기 */

// PerspectiveCamera( fov : Number, aspect : Number, near : Number, far : Number )
const camera = new THREE.PerspectiveCamera(
  75, // 시야각 (field of view)
  window.innerWidth / window.innerHeight, // 종횡비(aspect)
  0.1, // near
  1000 // far
);
camera.position.x = 2;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

/*  Messh 만들기 */
const geometry = new THREE.BoxGeometry(1, 1, 1); // 직육면체 지오메트리 만들기 BoxGeometry(1m, 1m, 1m)
// MeshBasicMaterial 는 빛의 영향을 받지 않아 조명이 없어도 보인다.
const material = new THREE.MeshBasicMaterial({
  color: "red" // 재질의 색상
});
const mesh = new THREE.Mesh(geometry, material); // 재질 = geometry(모양) + Material(재질)
scene.add(mesh); // 장면에 올리기

// 그리기
renderer.render(scene, camera);
