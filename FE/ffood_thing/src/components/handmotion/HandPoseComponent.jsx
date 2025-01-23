import React, { useRef, useEffect, useState } from "react"
import { Holistic } from "@mediapipe/holistic"
import { Camera } from "@mediapipe/camera_utils"

const HandAndArmSwipeComponent = () => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const initialDirectionRef = useRef({ hand: null, elbow: null })
  const swipeStateRef = useRef({
    isSwipeActive: false,
    lastSwipeTimestamp: 0,
    cooldownPeriod: 2000, // 2초 쿨다운
  })
  const [swipeMessage, setSwipeMessage] = useState("")

  useEffect(() => {
    const holistic = new Holistic({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
    })

    holistic.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    })

    holistic.onResults(onResults)

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await holistic.send({ image: videoRef.current })
      },
      width: 640,
      height: 480,
    })
    camera.start()

    function onResults(results) {
      const ctx = canvasRef.current.getContext("2d")
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

      const leftElbow = results.poseLandmarks?.[13]
      const leftWrist = results.poseLandmarks?.[15]
      const leftHandLandmarks = results.leftHandLandmarks

      const rightElbow = results.poseLandmarks?.[14]
      const rightWrist = results.poseLandmarks?.[16]
      const rightHandLandmarks = results.rightHandLandmarks

      const currentTime = Date.now()
      const { isSwipeActive, lastSwipeTimestamp, cooldownPeriod } = swipeStateRef.current

      // 사용자가 카메라에서 사라지면 방향 초기화
      if (!leftHandLandmarks && !rightHandLandmarks) {
        initialDirectionRef.current.hand = null
        initialDirectionRef.current.elbow = null
        swipeStateRef.current.isSwipeActive = false
        return
      }

      if (!isSwipeActive || currentTime - lastSwipeTimestamp > cooldownPeriod) {
        const leftSwipeResult = detectSwipe(leftHandLandmarks, leftWrist, leftElbow, "left")
        const rightSwipeResult = detectSwipe(rightHandLandmarks, rightWrist, rightElbow, "right")

        if (leftSwipeResult || rightSwipeResult) {
          swipeStateRef.current.isSwipeActive = true
          swipeStateRef.current.lastSwipeTimestamp = currentTime
        }
      }

      if (leftHandLandmarks) {
        drawLandmarks(ctx, leftHandLandmarks, "green")
        drawLine(ctx, leftWrist, leftElbow, "blue")
      }
      if (rightHandLandmarks) {
        drawLandmarks(ctx, rightHandLandmarks, "red")
        drawLine(ctx, rightWrist, rightElbow, "blue")
      }
      if (results.poseLandmarks) drawLandmarks(ctx, results.poseLandmarks, "yellow")
    }

    function detectSwipe(handLandmarks, wrist, elbow, handSide) {
      if (!handLandmarks || !wrist || !elbow) return false

      const currentHandX = wrist.x
      const currentElbowX = elbow.x

      if (!initialDirectionRef.current.hand || !initialDirectionRef.current.elbow) {
        initialDirectionRef.current.hand = currentHandX
        initialDirectionRef.current.elbow = currentElbowX
        return false
      }

      const isInitialSwipe = Math.abs(currentHandX - initialDirectionRef.current.hand) > 0.03
      const isOppositeDirection = Math.sign(currentHandX - initialDirectionRef.current.hand) !== Math.sign(currentElbowX - initialDirectionRef.current.elbow)

      if (isInitialSwipe && isOppositeDirection) {
        const swipeDirection = currentHandX < initialDirectionRef.current.hand ? "왼쪽" : "오른쪽"
        setSwipeMessage(`${handSide === "left" ? "왼손" : "오른손"}: ${swipeDirection}으로 반대방향으로 넘김`)

        setTimeout(() => setSwipeMessage(""), 2000)

        swipeStateRef.current.isSwipeActive = true
        swipeStateRef.current.lastSwipeTimestamp = Date.now()

        initialDirectionRef.current.hand = null
        initialDirectionRef.current.elbow = null

        return true
      }

      return false
    }

    function drawLandmarks(ctx, landmarks, color = "white") {
      landmarks.forEach((landmark) => {
        const x = landmark.x * canvasRef.current.width
        const y = landmark.y * canvasRef.current.height
        ctx.beginPath()
        ctx.arc(x, y, 5, 0, 2 * Math.PI)
        ctx.fillStyle = color
        ctx.fill()
      })
    }

    function drawLine(ctx, start, end, color = "white") {
      if (!start || !end) return
      const startX = start.x * canvasRef.current.width
      const startY = start.y * canvasRef.current.height
      const endX = end.x * canvasRef.current.width
      const endY = end.y * canvasRef.current.height
      ctx.beginPath()
      ctx.moveTo(startX, startY)
      ctx.lineTo(endX, endY)
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.stroke()
    }

    return () => {
      camera.stop()
    }
  }, [])

  return (
    <div>
      <video ref={videoRef} style={{ display: "none" }} autoPlay playsInline />
      <canvas
        ref={canvasRef}
        width="640"
        height="480"
        style={{
          border: "1px solid black",
          backgroundColor: "rgba(0,0,0,0.1)",
        }}
      />
      {swipeMessage && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            color: "blue",
            backgroundColor: "rgba(255,255,255,0.9)",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          {swipeMessage}
        </div>
      )}
    </div>
  )
}

export default HandAndArmSwipeComponent
