import React, { useRef, useEffect, useCallback } from "react"
import { Holistic } from "@mediapipe/holistic"
import { Camera } from "@mediapipe/camera_utils"

const GestureRecognition = ({ onChangePage }) => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  const handleResults = useCallback(
    (results) => {
      if (!results.leftHandLandmarks && !results.rightHandLandmarks) {
        onChangePage(null)
        return
      }

      const palmX = (results.leftHandLandmarks || results.rightHandLandmarks)[9].x
      if (palmX > 0.3) {
        onChangePage("이전 페이지")
      } else if (palmX < 0.7) {
        onChangePage("다음 페이지")
      } else {
        onChangePage(null)
      }
    },
    [onChangePage]
  )

  useEffect(() => {
    const holistic = new Holistic({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
    })

    holistic.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    })

    holistic.onResults(handleResults)

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await holistic.send({ image: videoRef.current })
      },
      width: 640,
      height: 480,
    })

    if (videoRef.current) {
      camera.start()
    }

    return () => {
      camera.stop()
    }
  }, [handleResults])

  return (
    <div>
      <video ref={videoRef} style={{ display: "none" }} autoPlay playsInline />
      <canvas ref={canvasRef} className="handpose-canvas" />
    </div>
  )
}

export default GestureRecognition
