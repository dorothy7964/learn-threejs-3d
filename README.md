## Local

- http://localhost:8080/
  <br/><br/>

## Node

- 20.12.2 사용 중
  <br/><br/>

## 폴더 설명

01_nomal

- three.js 사용 방법 1
- 일반 자바스크립트 파일 방식으로 확인해보기

02_module_basic

- three.js 사용 방법 2
- 모듈 방식으로 import 하기

03_webpack

- 패키지 설치 및 빌드 해보기

04_basic-threejs

    참고 : 04_basic-threejs/basic/src/main.js 에서 예제 주석 처리

    reademe.txt에 있는 패키지 설치 하기

- ex01_basic : 기본 장면 만들기 (Scene, Camera, Mesh)
- ex02_browserSize : 브라우저 창 사이즈 변경에 대응하기
- ex03_backgroundColor : 배경색, 투명도 설정하기
- ex04_light : 빛, 조명 설정하기
- ex05_animationBasic : 애니메이션 기본
- ex06_animationPerformance : 애니메이션 성능 보정
- ex06-02-animationPerformance : 애니메이션 성능 보정 (자바스크립트 내장 기능 이용)
- ex07_fog : 안개
- ex08_libraryAnimation : 라이브러리를 이용한 애니메이션

05_utility

    참고 : 05_utility/utility/src/main.js 에서 예제 주석 처리

    reademe.txt에 있는 패키지 설치 하기

- ex01_visualGuide : AxesHelper - 축, GridHelper - 격자무늬
- ex02_FPS : 초당 프레임 수(FPS) 체크하기
- ex03_GUI : GUI 컨트롤

06_transform

    참고 : 06_transform/transform/src/main.js 에서 예제 주석 처리

    reademe.txt에 있는 패키지 설치 하기

- ex01_position : 위치 이동
- ex02_scale : 크기 조정
- ex03_rotation : 회전
- ex04_scene_graph : 그룹 만들기

07_geometry

    참고 : 07_geometry/geometry/src/main.js 에서 예제 주석 처리

    reademe.txt에 있는 패키지 설치 하기

- ex01_basic_geometry : 여러가지 Geometry 살펴보기
- ex02_geometry_vertex : Geometry 정점(Vertex) position 이용하기

08_controls

    참고 : 08_controls/controls/src/main.js 에서 예제 주석 처리

    reademe.txt에 있는 패키지 설치 하기

- ex01_orbitControls : 카메라를 중심으로 궤도를 돌듯이 이동하며 특정 대상에 초점을 맞추고 안정적으로 관찰할 수 있는 컨트롤

- ex02_trackballControls : orbitControls보다 더 자유로운 3D 탐색할 수 있는 컨트롤

- ex03_flyControls : 자유롭게 3D 공간을 비행하듯이 움직일 수 있는 컨트롤

- ex04_firstPersonControls : 1인칭 시점에서 자유롭게 카메라 컨트롤, Fly Controls의 대체 구현

- ex05_pointerLockControls : PointerLock API를 사용하여 마우스 커서를 화면에서 숨기고 사용자가 마우스를 움직이는 방향에 따라 카메라의 시점을 변경해주는 컨트롤

- ex06_dragControls : 우스를 사용해 오브젝트를 드래그하고 이동할 수 있도록 해주는 컨트롤

- ex07_minecraftControls : 다양한 입력 장치의 설정, PointerLockControls에 키보드 컨트롤 추가

09_material

    참고 : 09_material/material/src/main.js 에서 예제 주석 처리

    reademe.txt에 있는 패키지 설치 하기

- ex01_meshBasicMaterial : Three.js에서 자주 사용되는 재질 중 하나이고 조명 영향을 받지 않는 것이 특징이다. 조명이나 복잡한 계산이 필요 없기 때문에 성능이 가장 우수한 재질 중 하나이다.

- ex02_meshLambertMaterial_meshPhongMaterial : 두 재질은 3D 객체의 표면에 어떻게 빛이 반사되고 표현될지를 결정해 준다.

  - MeshLambertMaterial - 하이라이트, 반사광 없는 재질
  - MeshPhongMaterial -하이라이트, 반사광 표현 가능

- ex03_meshStandardMaterial : MeshPhongMaterial는 덜 사실적인 반면 MeshStandardMaterial는 고품질의 사실적인 렌더링을 한다.

- ex04_flatShading : flatShading, 각지게 표현

- ex05_side : side, Mesh의 앞 뒷면

- ex06_textureLoader : 텍스쳐 이미지 로드하기

- ex07_loadingManager : 로딩 매니저 (여러개의 텍스쳐 이미지)

- ex08_repeatWrapping : 텍스쳐 변환 (위치 이동, 회전 등)시 RepeatWrapping을 사용해 텍스처가 물체의 UV 좌표를 벗어날 경우 텍스처가 반복되어 적용하기, 기준접 가운데로 놓고 싶다면 texture.center.x, texture.center.y를 0.5로 두기

- ex09_multiTextureCube : 여러 이미지 텍스쳐가 적용된 큐브,

  - magFilter - 텍스처가 확대될 때 텍스처의 픽셀이 어떻게 화면에 표시될지를 제어
  - THREE.NearestFilter - 부드러운 보간 없이 픽셀이 그대로 보이게 되어, 블록 모양의 픽셀화된 느낌을 준다.

- ex10_meshToonMaterial : 만화 느낌

- ex11_meshNormalMaterial : 각 법선의 방향에 따라 다른 색상을 부여

- ex12_meshMatcapMaterial : Matcap 텍스처를 사용하여 간단하게 색상과 조명 효과를 적용 가능

- ex13_meshStandardMaterial_effect : MeshStandardMaterial에 효과 더하기

- ex14_environmentMap : 3D 장면의 물체 표면에 반사되는 배경 이미지를 설정하여 물체가 주변 환경을 반사하는 효과를 주는 방법

- ex15, ex16은 ex14_environmentMap에 같이 적용해 놓음

- ex17_canvasTexture : Material에 Canvas 사용하기

10_light

    참고 : 10_light/light/src/main.js 에서 예제 주석 처리

    reademe.txt에 있는 패키지 설치 하기

- ex01_light_basic : Light 기본 사용법 + 애니메이션

  - AmbientLight : 전체적으로 은은하게 깔아주는 조명
  - DirectionalLight : 태양광 같은 조명
  - lightHelper: 조명을 시각적으로 확인하는 법
  - Dat GUI 만들기 : 객체의 속성을 실시간으로 조정할 수 있는 인터페이스를 이용해 조명 위치 조정
  - 삼각함수를 이용해 원형적인 움직임을 구현하기

- ex02_light_shadow : 그림자

  - 렌더러에 그림자를 설정 후 조명, 각 각 물체에서도 그림자를 설정해줘야 한다.
  - THREE.BasicShadowMap : 기본적인 그림자 맵, 속도는 가장 빠르지만 그림자가 뚜렷하지 않는다.
  - THREE.PCFShadowMap : Percentage Closer Filtering (PCF) 방식으로 렌더링. 그림자가 부드럽게 보이며, 기본 그림자 맵보다 디테일이 향상되지만 성능이 약간 저하 될 수 있다.
  - THREE.PCFSoftShadowMap : PCF 방식에 추가적인 소프트 처리를 적용하여 그림자가 매우 부드럽게 표현되지만 성능이 더 많이 요구 된다.
  - CastShadow : 물체에 그림자 생성 (카메라 범위, 받는 객체 receiveShadow 설정, 렌더러 설정)
  - Receive Shadow : 빛에 의해 투사된 다른 오브젝트의 그림자를 받을 수 있다.
  - shadow.mapSize : 그림자 맵의 해상도를 설정하는 속성

- ex03_pointLight : 빛이 모든 방향으로 퍼져나가는 조명 효과, 전구나 촛불 같은 광원을 표현

- ex04_spotLight : 스포트라이트 효과를 내는 데 사용, 무대 조명이나 손전등과 같은 빛을 표현

- ex05_hemisphereLight : 하늘과 땅을 기반으로 빛을 조절하는 조명 효과

- ex06_rectAreaLight : 직사각형 모양으로 균일한 빛을 방사하는 조명 효과, 실내 장면이나 부드러운 조명 효과가 필요한 곳에 많이 사용

11_raycaster

    참고 : 11_raycaster/raycaster/src/main.js 에서 예제 주석 처리

    reademe.txt에 있는 패키지 설치 하기

- ex01_intersects : 특정 방향의 광선(Ray)에 맞은 Mesh 판별하기

  - Raycaster를 방향 설정사용할 때 정규화된 벡터여야 한다. (단위: 1)

- ex02_eventClick : 클릭한 Mesh 감지하기

  - setFromCamera : Raycaster의 방향과 시작 위치를 카메라를 기준으로 설정, 마우스 위치를 3D 공간의 광선(Ray)으로 변환하는 데 사용

- ex03_preventDragClick : 드래그 클릭 방지

  - 위치와 경과시간으로 체크

- ex04_module_preventDragClick : 드래그 클릭 방지 모듈로 만들기
