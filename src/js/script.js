import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import FaceMesh from '@mediapipe/face_mesh'
import Camera from '@mediapipe/camera_utils'
import { drawConnectors } from '@mediapipe/drawing_utils'
console.log('FaceMesh', FaceMesh)
// import { GLTFLoader } from "../../node_modules/three/examples/js/loaders/GLTFLoader.js";
// import { GLTFLoader } from "./GLTFLoader.js";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const PerspectiveCamera = new THREE.PerspectiveCamera(
  90, // 시야각 (FOV, Field Of View)
  window.innerWidth / window.innerHeight, // 종횡비
  // near, far 절단면은 렌더링 거리를 의미한다
  0.1, // near 절단면
  1000 // far 절단면
);
PerspectiveCamera.position.set(0, 0, 20);
PerspectiveCamera.lookAt(0, 0, 0);

const material = new THREE.LineBasicMaterial({ color: 0x00ffff });
const points = [];
points.push(new THREE.Vector3(-10, 0, 0));
points.push(new THREE.Vector3(0, 10, 0));
points.push(new THREE.Vector3(10, 0, 0));

const geometry = new THREE.BufferGeometry().setFromPoints(points);
const line = new THREE.Line(geometry, material);
// console.log(line);

scene.add(line);
// const loader = new GLTFLoader();

// instantiate a loader
const loader = new OBJLoader();

const color = 0xffffff;
const intensity = 1;
const light = new THREE.AmbientLight(color, intensity);

scene.add(light);
// load a resource
loader.load(
  // resource URL
  "FinalBaseMesh.obj",
  // called when resource is loaded
  function (object) {
    scene.add(object);
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


renderer.render(scene, PerspectiveCamera);

// loader.load(
//   "FinalBaseMesh.obj",
//   function (gltf) {
//     scene.add(gltf.scene);
//   },
//   undefined,
//   function (error) {
//     console.error(error);
//   }
// );



const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
console.log(canvasElement.style)
console.log(canvasElement.style.width)
const pixelRatio = window.devicePixelRatio

canvasElement.style.width = '1280px'
canvasElement.width = 1280 * pixelRatio
canvasElement.style.height = '720px'
canvasElement.height = 720 * pixelRatio
console.log(canvasElement.style.width)

const canvasCtx = canvasElement.getContext('2d');
// canvasElement.style.width = canvasElement.width * pixelRatio + 'px'
// canvasElement.style.height = canvasElement.height * pixelRatio + 'px'
console.log('pixelRatio', pixelRatio)
console.log('canvasElement.width', canvasElement.width)
console.log('canvasElement.width * pixelRatio', canvasElement.width * pixelRatio)

function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
    results.image, 0, 0, canvasElement.width, canvasElement.height);
  if (results.multiFaceLandmarks) {
    for (const landmarks of results.multiFaceLandmarks) {
      drawConnectors(canvasCtx, landmarks, FaceMesh.FACEMESH_TESSELATION,
        { color: '#C0C0C070', lineWidth: 1 });
      drawConnectors(canvasCtx, landmarks, FaceMesh.FACEMESH_RIGHT_EYE, { color: '#FF3030' });
      drawConnectors(canvasCtx, landmarks, FaceMesh.FACEMESH_RIGHT_EYEBROW, { color: '#FF3030' });
      drawConnectors(canvasCtx, landmarks, FaceMesh.FACEMESH_LEFT_EYE, { color: '#30FF30' });
      drawConnectors(canvasCtx, landmarks, FaceMesh.FACEMESH_LEFT_EYEBROW, { color: '#30FF30' });
      drawConnectors(canvasCtx, landmarks, FaceMesh.FACEMESH_FACE_OVAL, { color: '#E0E0E0' });
      drawConnectors(canvasCtx, landmarks, FaceMesh.FACEMESH_LIPS, { color: '#E0E0E0' });
    }
  }
  canvasCtx.restore();
}

// const faceMesh = new FaceMesh({
//   locateFile: (file) => {
//     return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
//   }
// });
const faceMesh = new FaceMesh.FaceMesh()
faceMesh.setOptions({
  maxNumFaces: 1,
  minDetectionConfidence: 0.2,
  minTrackingConfidence: 0.2
});
faceMesh.onResults(onResults);

const camera = new Camera.Camera(videoElement, {
  onFrame: async () => {
    await faceMesh.send({ image: videoElement });
  },
  width: 1280,
  height: 720
});
camera.start();


// const animate = function () {
//   // setInterval을 사용해도 가능하다.
//   // 다만, requestAnimationFrame은 유저가 브라우저를 이탈했을 때 멈춰주는
//   // 기능이 구현되어있어서 편리하다
//   requestAnimationFrame(animate);

//   renderer.render(scene, camera);
// };

// animate();
