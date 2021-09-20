import * as THREE from "three";
import { Vector3 } from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  90, // 시야각 (FOV, Field Of View)
  window.innerWidth / window.innerHeight, // 종횡비
  // near, far 절단면은 렌더링 거리를 의미한다
  0.1, // near 절단면
  1000 // far 절단면
);
// camera.position.set(eyesCenterPos.x, eyesCenterPos.y, eyesCenterPos.z);
camera.position.set(5, 5, 5);
camera.lookAt(0, 0, 0);

function getLines(){
  const material = new THREE.MeshPhongMaterial({ color: 0x00ffff });
  const points = [];
  points.push(new THREE.Vector3(-10, 0, 0));
  points.push(new THREE.Vector3(0, 10, 0));
  points.push(new THREE.Vector3(10, 0, 0));
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geometry, material);
  return line
}

function getBox(width, height, depth, x, y, z, color=0x44aa88){
  const boxGeometry = new THREE.BoxGeometry(width, height, depth);
  const boxMaterial = new THREE.MeshPhongMaterial({ color: color });
  const cube = new THREE.Mesh(boxGeometry, boxMaterial);
  cube.position.set(x, y, z);
  return cube
}

function getXYZBias(){
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
  return [cylinderX, cylinderY, cylinderZ]
}

const cube = getBox(3,3,3, 0,0,0)
const [cylinderX, cylinderY, cylinderZ] = getXYZBias()

scene.add(cube);

scene.add(cylinderX);
scene.add(cylinderY);
scene.add(cylinderZ);



const loader = new OBJLoader();

const color = 0xffffff;
const intensity = 1;
// const light = new THREE.AmbientLight(color, intensity);
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(-1, 2, 4);
scene.add(light);


function getLoadOBJPromise(loader, filename){
  let promise = new Promise(
    function(resolve, reject){
      loader.load(
        // resource URL
        filename,
        // called when resource is loaded
        function (object) {
          // scene.add(object);
          // objectRes = object;
          resolve(object)
        },
        // called when loading is in progresses
        function (xhr) {
          console.log(filename + ":" + (xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        // called when loading has errors
        function (error) {
          console.log("An error happened");
          reject(error)
        }
      );
    }
  )
  return promise
}

let room
let roomPromise = getLoadOBJPromise(loader, "room.obj")
roomPromise.then(
  function(objectRes){
    room = objectRes
    scene.add(objectRes)
  }
)
.catch(
  function(error){
    console.log(error)
  }
)

let man
let manPromise = getLoadOBJPromise(loader, "FinalBaseMesh.obj")
manPromise.then(
  function(objectRes){
    man = objectRes
    console.log('man',man)
    man.position.set(-5, -5, -5)
    scene.add(objectRes)
  }
)
.catch(
  function(error){
    console.log(error)
  }
)


renderer.render(scene, camera);

function render(time) {
  time *= 0.001; // convert time to seconds
  cube.rotation.x = 0;
  cube.rotation.y = 0;
  // console.log(
  //   "eyesCenterPos.x, eyesCenterPos.y, eyesCenterPos.z",
  //   eyesCenterPos.x,
  //   eyesCenterPos.y,
  //   eyesCenterPos.z
  // );
  // camera.position.set(
  //   (0.5 - eyesCenterPos.x) * 5,
  //   (0.5 - eyesCenterPos.y) * 5 + 20,
  //   eyesCenterPos.z * 200 + 20
  // );
  // camera.position.set(10, 10, 10);
  try {
    // man.rotation.x = time;
    // man.rotation.y = time;
  } catch (error) {}

  renderer.render(scene, camera);

  requestAnimationFrame(render);
}
requestAnimationFrame(render);


