import * as THREE from "../../node_modules/three/build/three.module.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75, // 시야각 (FOV, Field Of View)
  window.innerWidth / window.innerHeight, // 종횡비
  // near, far 절단면은 렌더링 거리를 의미한다
  0.1, // near 절단면
  1000 // far 절단면
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

const animate = function () {
  // setInterval을 사용해도 가능하다.
  // 다만, requestAnimationFrame은 유저가 브라우저를 이탈했을 때 멈춰주는
  // 기능이 구현되어있어서 편리하다
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
};

animate();
