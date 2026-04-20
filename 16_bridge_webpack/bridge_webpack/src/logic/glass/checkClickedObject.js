/* ===============================
  === 클릭된 객체에 대한 처리 함수 ===
=============================== */

export function checkClickedObject(mesh) {
  // 유리 오브젝트가 아니면 무시
  if (!mesh.name.includes("glass")) return;
  console.log("📢 [main.js:242 유리판 클릭 시 노출]");
}
