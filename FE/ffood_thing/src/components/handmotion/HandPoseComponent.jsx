import React, { useRef, useEffect, useState } from "react"
import { Holistic } from "@mediapipe/holistic"
import PropTypes from "prop-types"
import { Camera } from "@mediapipe/camera_utils"
import "../../styles/recipe/RecipeComponent.css"

const HandPoseComponent = ({ currentStep, onNextStep, onPrevStep, pages }) => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const swipeTrackingRef = useRef({
    startX: null,
    isTracking: false,
    lastSwipeTimestamp: 0,
    cooldownPeriod: 1500, // 1.5초 쿨다운
    lastPositions: [],
  })
  const [swipeMessage, setSwipeMessage] = useState("")
  const [handDetected, setHandDetected] = useState(false)
  const [timer, setTimer] = useState(0) // 타이머 상태 추가
  const [isTimerRunning, setIsTimerRunning] = useState(false) // 타이머 실행 여부 상태 추가

  useEffect(() => {
    let timerInterval = null
    if (isTimerRunning) {
      timerInterval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1)
      }, 1000)
    } else {
      clearInterval(timerInterval)
    }
    return () => clearInterval(timerInterval)
  }, [isTimerRunning])

  // 손 위치 변화에 따른 타이머 제어 함수
  const handleTimerGesture = (handLandmarks) => {
    if (handLandmarks) {
      const palmY = handLandmarks[0].y // 손바닥의 Y 좌표를 가져옴

      // 손을 위로 올리면 타이머 시작
      if (palmY < 0.3 && !isTimerRunning) {
        setIsTimerRunning(true)
      }
      // 손을 아래로 내리면 타이머 일시 정지
      else if (palmY > 0.7 && isTimerRunning) {
        setIsTimerRunning(false)
      }
    }
  }

  const changePage = (direction) => {
    if (direction === "다음 페이지") {
      if (currentStep < pages.length - 1) {
        onNextStep()
      } else {
        setSwipeMessage("마지막 페이지 입니다")
      }
    } else if (direction === "이전 페이지") {
      if (currentStep > 0) {
        onPrevStep()
      } else {
        setSwipeMessage("첫 페이지 입니다")
      }
    }

    swipeTrackingRef.current.isTracking = false
    swipeTrackingRef.current.lastSwipeTimestamp = Date.now()
    swipeTrackingRef.current.lastPositions = []
    setTimeout(() => setSwipeMessage(""), 1000)
  }

  // 터치 이벤트 처리 함수
  const handleTouchStart = (e) => {
    const touch = e.touches[0]
    swipeTrackingRef.current.startX = touch.clientX
    swipeTrackingRef.current.isTracking = true
  }

  const handleTouchMove = (e) => {
    if (!swipeTrackingRef.current.isTracking) return

    const touch = e.touches[0]
    const distance = touch.clientX - swipeTrackingRef.current.startX

    if (Math.abs(distance) > 50) {
      // 감지 거리 임계값
      const screenWidth = window.innerWidth
      const touchStartX = swipeTrackingRef.current.startX

      if (touchStartX > screenWidth / 2 && distance < 0) {
        if (currentStep < pages.length - 1) {
          setSwipeMessage("다음 페이지")
          changePage("다음 페이지")
        } else {
          setSwipeMessage("마지막 페이지 입니다")
        }
      } else if (touchStartX < screenWidth / 2 && distance > 0) {
        setSwipeMessage("이전 페이지")
        changePage("이전 페이지")
      }

      swipeTrackingRef.current.isTracking = false
      setTimeout(() => setSwipeMessage(""), 1000)
    }
  }

  const handleTouchEnd = () => {
    swipeTrackingRef.current.isTracking = false
  }

  useEffect(() => {
    const holistic = new Holistic({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
    })

    holistic.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.7, // 신뢰도 상향
      minTrackingConfidence: 0.7,
    })

    holistic.onResults(onResults)

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        if (videoRef.current) {
          await holistic.send({ image: videoRef.current })
        }
      },
      width: 640,
      height: 480,
    })
    if (videoRef.current) {
      camera.start()
    }

    function onResults(results) {
      if (!canvasRef.current) return
      const ctx = canvasRef.current.getContext("2d")
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

      const handLandmarks = results.leftHandLandmarks || results.rightHandLandmarks

      const currentTime = Date.now()

      if (!handLandmarks) {
        // 손이 인식되지 않으면 초기화
        swipeTrackingRef.current.isTracking = false
        swipeTrackingRef.current.lastPositions = []
        setHandDetected(false)
        return
      }

      setHandDetected(true)

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
          setSwipeMessage(direction)

          changePage(direction)
        }
      }

      // 타이머 제어 함수 호출
      handleTimerGesture(handLandmarks)
    }

    return () => {
      if (camera) {
        camera.stop()
      }
    }
  }, [isTimerRunning]) // 타이머 상태를 의존성 배열에 추가

  if (!pages || pages.length === 0) {
    return <div>No pages available</div>
  }

  if (!pages[currentStep]) {
    return (
      <div className="endding-comment" onClick={() => window.location.reload()}>
        레시피 화면으로
      </div>
    )
  }

  const currentProcess = pages[currentStep]

  return (
    <div className="handpose-container3" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
      <video ref={videoRef} style={{ display: "none" }} autoPlay playsInline />
      <canvas ref={canvasRef} className="handpose-canvas" />
      <div className="card-div7">
        <div className="steps3">
          <div className="process-item3">
            <h2 className="steps-h23">
              {currentProcess.processOrder}. {currentProcess.processExplain}
            </h2>
          </div>
          <div className="process-image-container3">
            {currentProcess.images &&
              currentProcess.images.map((image, imgIndex) => <img key={imgIndex} src={image.imageUrl} alt={`Process ${currentProcess.processOrder}`} className="process-image3" />)}
          </div>
          <hr />
        </div>
      </div>
      {swipeMessage && <div className="swipe-message">{swipeMessage}</div>}
      <div className="timer3">
        <img className="timer-image3" src="/images/timerequired.png" alt="Time Required" />
        {Math.floor(timer / 60)}분 {timer % 60}초
      </div>
      {currentStep === pages.length - 1 && <div className="end-message">마지막 페이지 입니다</div>}
    </div>
  )
}

HandPoseComponent.propTypes = {
  currentStep: PropTypes.number.isRequired,
  onNextStep: PropTypes.func.isRequired,
  onPrevStep: PropTypes.func.isRequired,
  pages: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default HandPoseComponent
