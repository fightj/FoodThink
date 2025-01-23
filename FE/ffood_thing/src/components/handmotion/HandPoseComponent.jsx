import React, { useRef, useEffect, useState } from "react"
import { Hands } from "@mediapipe/hands"
import { Camera } from "@mediapipe/camera_utils"

const HandPoseComponent = ({ onNextPage, onPrevPage }) => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const lastActionTimeRef = useRef(0) // 마지막 동작 시간을 저장할 ref
  const [isInCooldown, setIsInCooldown] = useState(false)

  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    })

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    })

    hands.onResults(onResults)

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await hands.send({ image: videoRef.current })
      },
      width: 640,
      height: 480,
    })
    camera.start()

    // 페이지 이동을 처리하는 함수
    const handlePageChange = (direction) => {
      const currentTime = Date.now()
      const cooldownPeriod = 2000 // 2초 쿨다운

      // 마지막 동작으로부터 쿨다운 기간이 지났는지 확인
      if (currentTime - lastActionTimeRef.current > cooldownPeriod) {
        if (direction === "left") {
          onNextPage()
        } else {
          onPrevPage()
        }

        // 마지막 동작 시간 업데이트
        lastActionTimeRef.current = currentTime

        // 쿨다운 상태 표시
        setIsInCooldown(true)
        setTimeout(() => setIsInCooldown(false), cooldownPeriod)
      }
    }

    function onResults(results) {
      const ctx = canvasRef.current.getContext("2d")
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0]

        // 검지 손가락 방향 계산
        const indexBase = landmarks[5]
        const indexTip = landmarks[8]
        const deltaX = indexTip.x - indexBase.x
        const threshold = 0.1

        // 명확한 방향이 감지되면 페이지 이동 시도
        if (Math.abs(deltaX) > threshold) {
          handlePageChange(deltaX < 0 ? "left" : "right")
        }

        // 시각화
        ctx.strokeStyle = isInCooldown ? "red" : "white"
        ctx.lineWidth = 2

        // 손가락 포인트 그리기
        for (const landmark of landmarks) {
          const x = landmark.x * canvasRef.current.width
          const y = landmark.y * canvasRef.current.height
          ctx.beginPath()
          ctx.arc(x, y, 5, 0, 2 * Math.PI)
          ctx.fillStyle = isInCooldown ? "red" : "white"
          ctx.fill()
        }
      }
    }

    return () => {
      camera.stop()
    }
  }, [onNextPage, onPrevPage])

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
      {isInCooldown && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            color: "red",
            backgroundColor: "rgba(255,255,255,0.8)",
            padding: "5px",
            borderRadius: "5px",
          }}
        >
          페이지 이동 중... 잠시만 기다려주세요
        </div>
      )}
    </div>
  )
}

export default HandPoseComponent
