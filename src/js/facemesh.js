import FaceMesh from '@mediapipe/face_mesh'
import Camera from '@mediapipe/camera_utils'
import { drawConnectors } from '@mediapipe/drawing_utils'

const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const pixelRatio = window.devicePixelRatio

canvasElement.style.width = '400px'
canvasElement.width = 400 * pixelRatio
canvasElement.style.height = '300px'
canvasElement.height = 300 * pixelRatio

const canvasCtx = canvasElement.getContext('2d');


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

});

camera.start();