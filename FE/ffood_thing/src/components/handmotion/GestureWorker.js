// GestureWorker.js
importScripts("https://cdn.jsdelivr.net/npm/@mediapipe/holistic/holistic.min.js")
importScripts("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js")

const holistic = new Holistic({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
})

holistic.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7,
})

holistic.onResults((results) => {
  postMessage(results)
})

self.onmessage = async (e) => {
  const { type, image } = e.data
  if (type === "sendFrame" && image) {
    await holistic.send({ image })
  }
}
