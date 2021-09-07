const videoElement = document.getElementsByClassName("input_video")[0];
const canvasElement = document.getElementsByClassName("output_canvas")[0];
const canvasCtx = canvasElement.getContext("2d");

let eyesCenterPos = { x: 0, y: 15, z: 20 };
function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
    results.image,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );
  if (results.multiFaceLandmarks) {
    for (const landmarks of results.multiFaceLandmarks) {
      // landmarks 6번이 미간 포인트
      eyesCenterPos = landmarks[6];
      drawLandmarks(canvasCtx, [landmarks[6]], {
        color: "#FF0000",
        lineWidth: 2,
      });
    }
  }
  canvasCtx.restore();
}

const faceMesh = new FaceMesh({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
  },
});
faceMesh.setOptions({
  maxNumFaces: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});
faceMesh.onResults(onResults);

const webCam = new Camera(videoElement, {
  onFrame: async () => {
    await faceMesh.send({ image: videoElement });
  },
  width: 1280,
  height: 720,
});
webCam.start();

import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
// import { GLTFLoader } from "../../node_modules/three/examples/js/loaders/GLTFLoader.js";
// import { GLTFLoader } from "./GLTFLoader.js";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75, // 시야각 (FOV, Field Of View)
  window.innerWidth / window.innerHeight, // 종횡비
  // near, far 절단면은 렌더링 거리를 의미한다
  0.01, // near 절단면
  1000 // far 절단면
);
// console.log(
//   "eyesCenterPos.x, eyesCenterPos.y, eyesCenterPos.z",
//   eyesCenterPos.x,
//   eyesCenterPos.y,
//   eyesCenterPos.z
// );
camera.position.set(eyesCenterPos.x, eyesCenterPos.y, eyesCenterPos.z);
camera.lookAt(0, 10, 0);

const material = new THREE.MeshPhongMaterial({ color: 0x00ffff });
const points = [];
points.push(new THREE.Vector3(-10, 0, 0));
points.push(new THREE.Vector3(0, 10, 0));
points.push(new THREE.Vector3(10, 0, 0));

const boxGeometry = new THREE.BoxGeometry(10, 10, 10);
const boxMaterial = new THREE.MeshPhongMaterial({ color: 0x44aa88 });
const cube = new THREE.Mesh(boxGeometry, boxMaterial);
cube.position.set(0, 10, 0);
scene.add(cube);

const geometry = new THREE.BufferGeometry().setFromPoints(points);
const line = new THREE.Line(geometry, material);
// console.log(line);

scene.add(line);
// const loader = new GLTFLoader();

// instantiate a loader
const loader = new OBJLoader();

const color = 0xffffff;
const intensity = 1;
// const light = new THREE.AmbientLight(color, intensity);
// const color = 0xffffff;
// const intensity = 1;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(-1, 2, 4);
scene.add(light);

scene.add(light);
// load a resource
let man;
loader.load(
  // resource URL
  "FinalBaseMesh.obj",
  // called when resource is loaded
  function (object) {
    // scene.add(object);
    man = object;
    console.log("added");
  },
  // called when loading is in progresses
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  // called when loading has errors
  function (error) {
    console.log("An error happened");
  }
);

// loader.load(
//   "FinalBaseMesh.obj",
//   function (gltf) {
//     scene.add(gltf.scene);
//   },
renderer.render(scene, camera);

function render(time) {
  time *= 0.001; // convert time to seconds
  cube.rotation.x = 0.5;
  cube.rotation.y = 0.5;
  // console.log(
  //   "eyesCenterPos.x, eyesCenterPos.y, eyesCenterPos.z",
  //   eyesCenterPos.x,
  //   eyesCenterPos.y,
  //   eyesCenterPos.z
  // );
  camera.position.set(
    (0.5 - eyesCenterPos.x) * 20,
    (0.5 - eyesCenterPos.y) * 20 + 15,
    eyesCenterPos.z * 20 + 20
  );
  try {
    // man.rotation.x = time;
    // man.rotation.y = time;
  } catch (error) {}

  renderer.render(scene, camera);

  requestAnimationFrame(render);
}
requestAnimationFrame(render);
// const animate = function () {
//   // setInterval을 사용해도 가능하다.
//   // 다만, requestAnimationFrame은 유저가 브라우저를 이탈했을 때 멈춰주는
//   // 기능이 구현되어있어서 편리하다
//   requestAnimationFrame(animate);

//   renderer.render(scene, camera);
// };

// animate();
