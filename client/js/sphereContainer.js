import * as THREE from "three";
import { CSS3DRenderer } from "three/addons/renderers/CSS3DRenderer.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const MESSAGE_ARR = [
  "random message 1",
  "random message 2",
  "random message 3",
  // ... Add more messages up to "random message 100"
];

// Scene, Camera, Renderer 초기화
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container").appendChild(renderer.domElement);

// CSS3DRenderer 추가
const cssRenderer = new CSS3DRenderer();
cssRenderer.setSize(window.innerWidth, window.innerHeight);
cssRenderer.domElement.style.position = "absolute";
cssRenderer.domElement.style.top = 0;
document.getElementById("container").appendChild(cssRenderer.domElement);

// 구체 생성
const radius = Math.min(window.innerWidth, window.innerHeight) / 2;
const sphereGeometry = new THREE.SphereGeometry(radius, 32, 32);
const sphereMaterial = new THREE.MeshBasicMaterial({
  color: 0x0077ff,
  wireframe: true,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

// 메시지 생성 및 배치
const messageGroup = new THREE.Group();
MESSAGE_ARR.forEach((message) => {
  const messageElement = document.createElement("div");
  messageElement.style.position = "absolute";
  messageElement.style.color = "white";
  messageElement.textContent = message;

  const objectCSS = new CSS3DObject(messageElement);

  // 랜덤한 구체 표면 위치
  const phi = Math.acos(2 * Math.random() - 1);
  const theta = 2 * Math.PI * Math.random();
  objectCSS.position.set(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.sin(phi) * Math.sin(theta),
    radius * Math.cos(phi)
  );
  messageGroup.add(objectCSS);
});
scene.add(messageGroup);

// 카메라 위치 설정
camera.position.z = radius * 2;

// OrbitControls 설정
const controls = new OrbitControls(camera, cssRenderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;

// 창 크기 변경 시 카메라 및 렌더러 업데이트
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  cssRenderer.setSize(window.innerWidth, window.innerHeight);
});

// 애니메이션 루프
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
  cssRenderer.render(scene, camera);
}
animate();
