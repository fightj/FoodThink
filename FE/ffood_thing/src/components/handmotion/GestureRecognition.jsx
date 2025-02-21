import React, { useRef, useEffect, useState } from "react"
import { Holistic } from "@mediapipe/holistic"
import { Camera } from "@mediapipe/camera_utils"

const GestureRecognition = ({ onChangePage }) => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const cameraRef = useRef(null) // 카메라 참조 추가
  const swipeTrackingRef = useRef({ startX: null, isTracking: false, lastPositions: [], cooldownPeriod: 1000, lastSwipeTimestamp: 0 }) // 스와이프 추적 참조
  const [isPageChanging, setIsPageChanging] = useState(false) // 페이지 이동 상태 추가

  const handleResults = (results) => {
    if (isPageChanging) return // 페이지 이동 중이면 처리하지 않음

    const handLandmarks = results.leftHandLandmarks || results.rightHandLandmarkscd false
    const currentTime = Date.now()

    if (!handLandmarks) {
      // 손이 인식되지 않으면 초기화
      swipeTrackingRef.current.isTracking = false
      swipeTrackingRef.current.lastPositions = []
      setIsPageChanging(false)
      return
    }

    // 쿨다운 체크
    if (currentTime - swipeTrackingRef.current.lastSwipeTimestamp < swipeTrackingRef.current.cooldownPeriod) {
      return
    }

    const palmX = handLandmarks[9].x

    // 이동 평균 필터 적용
    swipeTrackingRef.current.lastPositions.push(palmX)
    if (swipeTrackingRef.current.lastPositions.length > 5) {
      swipeTrackingRef.current.lastPositions.shift() // 최근 5개의 데이터만 유지
    }
    const avgX = swipeTrackingRef.current.lastPositions.reduce((sum, x) => sum + x, 0) / swipeTrackingRef.current.lastPositions.length

    // 스와이프 시작 감지
    if (!swipeTrackingRef.current.isTracking) {
      swipeTrackingRef.current.startX = avgX
      swipeTrackingRef.current.isTracking = true
    } else {
      // 스와이프 방향 및 거리 계산
      const distance = avgX - swipeTrackingRef.current.startX

      if (Math.abs(distance) > 0.2) {
        const direction = distance > 0 ? "다음 페이지" : "이전 페이지"
        console.log(`핸드모션 ${direction} 인식`)
        setIsPageChanging(true) // 페이지 이동 상태로 설정
        onChangePage(direction)
        swipeTrackingRef.current.lastSwipeTimestamp = currentTime // 마지막 스와이프 시간 갱신

        // 카메라를 1초 동안 중지하고 다시 시작합니다.
        cameraRef.current.stop()
        setTimeout(() => {
          if (videoRef.current) {
            cameraRef.current.start()
          }
          console.log("1초 쉬기")
          setIsPageChanging(false) // 페이지 이동 상태 해제
          swipeTrackingRef.current.isTracking = false // 스와이프 추적 초기화
          swipeTrackingRef.current.lastPositions = [] // 이동 평균 초기화
        }, 1000)
      }
    }
  }

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
        await new Promise((resolve) => setTimeout(resolve, 100)) // 프레임 처리를 지연시켜 과부하 감소
        await holistic.send({ image: videoRef.current })
      },
      width: 640,
      height: 480,
      fps: 15, // 프레임 레이트를 15로 설정
    })

    cameraRef.current = camera // 카메라 참조 설정

    if (videoRef.current) {
      camera.start()
    }

    return () => {
      camera.stop()
    }
  }, [])

  return (
    <div>
      <video ref={videoRef} style={{ display: "none" }} autoPlay playsInline />
      <canvas ref={canvasRef} className="handpose-canvas" />
    </div>
  )
}

export default GestureRecognition
