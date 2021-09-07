// const videoElement = document.getElementsByClassName("input_video")[0];
// const canvasElement = document.getElementsByClassName("output_canvas")[0];
// const canvasCtx = canvasElement.getContext("2d");

// function onResults(results) {
//   canvasCtx.save();
//   canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
//   canvasCtx.drawImage(
//     results.image,
//     0,
//     0,
//     canvasElement.width,
//     canvasElement.height
//   );
//   if (results.multiFaceLandmarks) {
//     // console.log("results.multiFaceLandmarks", results.multiFaceLandmarks);
//     for (const landmarks of results.multiFaceLandmarks) {
//       // let eyesPosOrigin = FACEMESH_LEFT_EYE.concat(FACEMESH_RIGHT_EYE);
//       // // console.log("tmp", tmp);
//       // let faceMeshEyeSet = new Set(eyesPosOrigin.flat());
//       // // let faceMeshLeftEyeSet = new Set(FACEMESH_LEFT_EYE.flat());
//       // // console.log("faceMeshRightEyeSet", faceMeshRightEyeSet);
//       // let faceMeshEyePos = [...faceMeshEyeSet];
//       // let eyesCenterX = 0;
//       // let eyesCenterY = 0;
//       // let eyesCenterZ = 0;
//       // faceMeshEyePos.forEach(function (pos) {
//       //   eyesCenterX += landmarks[pos].x;
//       //   eyesCenterY += landmarks[pos].y;
//       //   eyesCenterZ += landmarks[pos].z;
//       // });
//       // eyesCenterX /= faceMeshEyePos.length;
//       // eyesCenterY /= faceMeshEyePos.length;
//       // eyesCenterZ /= faceMeshEyePos.length;

//       // canvasCtx.beginPath();
//       // // canvasElement.width, canvasElement.height
//       // canvasCtx.arc(
//       //   (eyesCenterX * canvasElement.width) / 30,
//       //   (eyesCenterY * canvasElement.height) / 30,
//       //   5,
//       //   0,
//       //   Math.PI * 2,
//       //   true
//       // );
//       // canvasCtx.fillStyle = "orange";
//       // // canvasCtx.stroke();
//       // canvasCtx.fill();
//       // 이럴 필요 없다
//       // drawLandmarks(
//       //   canvasCtx,
//       //   [
//       //     {
//       //       x: eyesCenterX,
//       //       y: eyesCenterY,
//       //       z: eyesCenterZ,
//       //     },
//       //   ],
//       //   { color: "#FF0000", lineWidth: 2 }
//       // );

//       // landmarks 6번이 미간 포인트
//       drawLandmarks(canvasCtx, [landmarks[6]], {
//         color: "#FF0000",
//         lineWidth: 2,
//       });
//       // canvasCtx.drawCircle(eyesCenterX, eyesCenterY);
//       // const rightEyeCenterX = FACEMESH_RIGHT_EYE[0].reduce(function add(
//       //   sum,
//       //   currValue
//       // ) {
//       //   return sum + currValue;
//       // },
//       // 0);
//       // const rightEyeCenterY = FACEMESH_RIGHT_EYE[1].reduce(function add(
//       //   sum,
//       //   currValue
//       // ) {
//       //   return sum + currValue;
//       // },
//       // 0);
//       // console.log("FACEMESH_RIGHT_EYE", rightEyeCenterX, rightEyeCenterY);
//       // drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION, {
//       //   color: "#C0C0C070",
//       //   lineWidth: 1,
//       // });
//       // drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYE, {
//       //   color: "#FF3030",
//       // });
//       // drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYEBROW, {
//       //   color: "#FF3030",
//       // });
//       // drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYE, {
//       //   color: "#30FF30",
//       // });
//       // drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYEBROW, {
//       //   color: "#30FF30",
//       // });
//       // drawConnectors(canvasCtx, landmarks, FACEMESH_FACE_OVAL, {
//       //   color: "#E0E0E0",
//       // });
//       // drawConnectors(canvasCtx, landmarks, FACEMESH_LIPS, { color: "#E0E0E0" });
//     }
//   }
//   canvasCtx.restore();
// }

// const faceMesh = new FaceMesh({
//   locateFile: (file) => {
//     return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
//   },
// });
// faceMesh.setOptions({
//   maxNumFaces: 1,
//   minDetectionConfidence: 0.5,
//   minTrackingConfidence: 0.5,
// });
// faceMesh.onResults(onResults);

// const camera = new Camera(videoElement, {
//   onFrame: async () => {
//     await faceMesh.send({ image: videoElement });
//   },
//   width: 1280,
//   height: 720,
// });
// camera.start();
