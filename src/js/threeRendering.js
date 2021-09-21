import * as THREE from "three";
import { Vector3 } from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { getEyePos } from "./facemesh";

// 눈 위치 받아오기
let eyesCenterPos = { x: 0, y: 15, z: 20 }; // 최초 카메라 위치 설정
function onResults(results) {
  if (results.multiFaceLandmarks) {
    for (const landmarks of results.multiFaceLandmarks) {
      eyesCenterPos = landmarks[6]; // 눈 중앙 landmark
    }
  }
}
getEyePos(onResults); // onResult가 프레임별로 실행됨

// three.js 세팅
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 카메라 세팅
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  90, // 시야각 (FOV, Field Of View)
  window.innerWidth / window.innerHeight, // 종횡비
  // near, far 절단면은 렌더링 거리를 의미한다
  0.1, // near 절단면
  1000 // far 절단면
);
camera.position.set(eyesCenterPos.x, eyesCenterPos.y, eyesCenterPos.z);
camera.lookAt(0, 0, 0);


// scene에 도형들 추가
function getLines() {
  const material = new THREE.MeshPhongMaterial({ color: 0x00ffff });
  const points = [];
  points.push(new THREE.Vector3(-10, 0, 0));
  points.push(new THREE.Vector3(0, 10, 0));
  points.push(new THREE.Vector3(10, 0, 0));
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geometry, material);
  return line;
}

function getBox(width, height, depth, x, y, z, color = 0x44aa88) {
  const boxGeometry = new THREE.BoxGeometry(width, height, depth);
  const boxMaterial = new THREE.MeshPhongMaterial({ color: color });
  const cube = new THREE.Mesh(boxGeometry, boxMaterial);
  cube.position.set(x, y, z);
  return cube;
}

function getXYZBias() {
  const cylinderXGeometry = new THREE.CylinderGeometry(0.1, 0.1, 100, 32);
  const cylinderXMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const cylinderX = new THREE.Mesh(cylinderXGeometry, cylinderXMaterial);
  cylinderX.rotation.z = Math.PI / 2;
  cylinderX.position.set(0, 0, 0);

  const cylinderYGeometry = new THREE.CylinderGeometry(0.1, 0.1, 100, 32);
  const cylinderYMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cylinderY = new THREE.Mesh(cylinderYGeometry, cylinderYMaterial);
  cylinderY.rotation.x = Math.PI / 2;
  // cylinderY.position.set(0, 0, 0);

  const cylinderZGeometry = new THREE.CylinderGeometry(0.1, 0.1, 100, 32);
  const cylinderZMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
  const cylinderZ = new THREE.Mesh(cylinderZGeometry, cylinderZMaterial);
  // cylinderZ.rotation.x = 90;
  // cylinderZ.rotation.z = 90;
  return [cylinderX, cylinderY, cylinderZ];
}

const cube = getBox(3, 3, 3, 0, 0, 0);
const [cylinderX, cylinderY, cylinderZ] = getXYZBias();

scene.add(cube);

scene.add(cylinderX);
scene.add(cylinderY);
scene.add(cylinderZ);

// 객체 로더 선언(Promise)
const loader = new OBJLoader();
function getLoadOBJPromise(loader, filename) {
  let promise = new Promise(function (resolve, reject) {
    loader.load(
      // resource URL
      filename,
      // called when resource is loaded
      function (object) {
        // scene.add(object);
        // objectRes = object;
        resolve(object);
      },
      // called when loading is in progresses
      function (xhr) {
        console.log(
          filename + ":" + (xhr.loaded / xhr.total) * 100 + "% loaded"
        );
      },
      // called when loading has errors
      function (error) {
        console.log("An error happened");
        reject(error);
      }
    );
  });
  return promise;
}

// 객체 로딩 후 scene 추가
let room;
let roomPromise = getLoadOBJPromise(loader, "room.obj");
roomPromise
  .then(function (objectRes) {
    room = objectRes;
    scene.add(objectRes);
  })
  .catch(function (error) {
    console.log(error);
  });

let man;
let manPromise = getLoadOBJPromise(loader, "FinalBaseMesh.obj");
manPromise
  .then(function (objectRes) {
    man = objectRes;
    console.log("man", man);
    man.position.set(-5, -5, -5);
    scene.add(objectRes);
  })
  .catch(function (error) {
    console.log(error);
  });

// 조명 설정
const color = 0xffffff;
const intensity = 1;
// const light = new THREE.AmbientLight(color, intensity);
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(-1, 2, 4);
scene.add(light);

// 렌더링
renderer.render(scene, camera);

// 카메라 위치를 조절하기 위한 slider들 정보
let xOffset,
  yOffset,
  zOffset = [0, 20, 20];
let xSens,
  ySens,
  zSens = [5, 5, 200];

let xOffsetDisplay = document.getElementById("xOffsetDisplay");
let yOffsetDisplay = document.getElementById("yOffsetDisplay");
let zOffsetDisplay = document.getElementById("zOffsetDisplay");
let xSensDisplay = document.getElementById("xSensDisplay");
let ySensDisplay = document.getElementById("ySensDisplay");
let zSensDisplay = document.getElementById("zSensDisplay");

let posX = 0
let posY = 0
let posZ = 0
let currentPosX = posX
let currentPosY = posY
let currentPosZ = posZ

let keys = []
window.onkeydown = (e) => {
  keys = (keys || [])
  keys[e.keyCode] = true;
  console.log(e.key)
  console.log(e)
  console.log(keys)
  if (keys[87]) {
    posZ -= 1
  }
  if (keys[65]) {
    posX -= 1
  }
  if (keys[83]) {
    posZ += 1
  }
  if (keys[68]) {
    posX += 1
  }
  if (keys[32]) {
    posY += 1
  }
  if (keys[67]) {
    posY -= 1
  }
}

window.onkeyup = (e) => {
  keys = (keys || [])
  keys[e.keyCode] = true;
  console.log(e.key)
  if (e.key === 'w') {
    keys[87] = false
  }
  if (e.key === 'a') {
    keys[65] = false
  }
  if (e.key === 's') {
    keys[83] = false
  }
  if (e.key === 'd') {
    keys[68] = false
  }
  if (e.key === ' ') {
    keys[32] = false
  }
  if (e.key === 'c') {
    keys[67] = false
  }
}

function render(time) {
  currentPosX = currentPosX + (posX - currentPosX) * 0.5
  currentPosY = currentPosY + (posY - currentPosY) * 0.5
  currentPosZ = currentPosZ + (posZ - currentPosZ) * 0.5

  time *= 0.001; // convert time to seconds
  cube.rotation.x = 0;
  cube.rotation.y = 0;

  xOffset = Number(document.getElementById("xOffset").value);
  yOffset = Number(document.getElementById("yOffset").value);
  zOffset = Number(document.getElementById("zOffset").value);

  xSens = Number(document.getElementById("xSens").value);
  ySens = Number(document.getElementById("ySens").value);
  zSens = Number(document.getElementById("zSens").value);

  xOffsetDisplay.innerHTML = xOffset;
  yOffsetDisplay.innerHTML = yOffset;
  zOffsetDisplay.innerHTML = zOffset;
  xSensDisplay.innerHTML = xSens;
  ySensDisplay.innerHTML = ySens;
  zSensDisplay.innerHTML = zSens;

  camera.position.set(
    (0.5 - eyesCenterPos.x) * xSens + xOffset + currentPosX,
    (0.5 - eyesCenterPos.y) * ySens + yOffset + currentPosY,
    eyesCenterPos.z * zSens + zOffset + currentPosZ
  );

  // camera.position.set(10, 10, 10);
  try {
    // man.rotation.x = time;
    // man.rotation.y = time;
  } catch (error) { }

  renderer.render(scene, camera);

  requestAnimationFrame(render);
}
requestAnimationFrame(render);
