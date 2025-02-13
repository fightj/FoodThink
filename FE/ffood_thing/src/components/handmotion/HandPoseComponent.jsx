import React, { useRef, useEffect, useState } from "react"
import { Holistic } from "@mediapipe/holistic"
import PropTypes from "prop-types"
import { Camera } from "@mediapipe/camera_utils"
import "../../styles/recipe/RecipeComponent.css"
import VoiceRecognitionComponent from "../voice/VoiceRecognitionComponent"
import axios from "axios"

const HandPoseComponent = ({ recipe, currentStep, onNextStep, onPrevStep, onClose }) => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const swipeTrackingRef = useRef({
    startX: null,
    isTracking: false,
    lastSwipeTimestamp: 0,
    cooldownPeriod: 1500,
    lastPositions: [],
  })
  const [swipeMessage, setSwipeMessage] = useState("")
  const [handDetected, setHandDetected] = useState(false)
  const [timer, setTimer] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false)
  const alarmAudioRef = useRef(new Audio("/sound/Alarm.wav"))

  const [currentProcess, setCurrentProcess] = useState({})
  const [totalProcess, setTotalProcess] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [isDataFetched, setIsDataFetched] = useState(false)

  const token = localStorage.getItem("accessToken")
  const recipeId = recipe.recipeId

  const fetchProcessData = async (recipeId, page) => {
    try {
      const response = await axios.get(`https://i12e107.p.ssafy.io/api/recipes/read/processes/${recipeId}/${page}`)
      const data = response.data
      setCurrentProcess(data.processes[0])
      setTotalProcess(data.totalProcess)
      if (!isDataFetched) {
        setTotalPages(data.totalPages)
        setIsDataFetched(true)
      }
    } catch (error) {
      console.error("Error fetching process data:", error)
    }
  }

  useEffect(() => {
    fetchProcessData(recipeId, currentStep)
  }, [recipeId, currentStep])

  const playSound = (url) => {
    const audio = new Audio(url)
    audio.play()
  }

  const playAlarm = () => {
    alarmAudioRef.current.currentTime = 0
    alarmAudioRef.current.play()
    setIsAlarmPlaying(true)
  }

  const stopAlarm = () => {
    alarmAudioRef.current.pause()
    alarmAudioRef.current.currentTime = 0
    setIsAlarmPlaying(false)
  }

  useEffect(() => {
    let timerInterval = null
    if (isTimerRunning) {
      timerInterval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 3 && prevTimer > 1) {
            console.log(prevTimer)
          }
          if (prevTimer === 1 && !isAlarmPlaying) {
            playAlarm()
          }
          return prevTimer > 0 ? prevTimer - 1 : 0
        })
      }, 1000)
    } else {
      clearInterval(timerInterval)
    }
    return () => clearInterval(timerInterval)
  }, [isTimerRunning, isAlarmPlaying])

  const changePage = (direction) => {
    if (direction === "다음 페이지") {
      if (currentStep < totalPages - 1) {
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

  const speakText = (text) => {
    const synth = window.speechSynthesis
    const utterance = new SpeechSynthesisUtterance(text)
    synth.speak(utterance)
  }

  const handleResponse = (data) => {
    const { intent, data: responseData } = data

    if (!intent) {
      const errorMessage = responseData.message
      console.log("에러 메시지:", errorMessage)
      speakText(errorMessage)
      return
    }

    switch (intent) {
      case "현재단계읽기":
        console.log(currentProcess.processExplain)
        const currentText = `${currentProcess.processOrder}. ${currentProcess.processExplain}`
        console.log("읽을 텍스트:", currentText)
        speakText(currentText)
        break
      case "이전단계돌아가기":
        if (currentStep > 0) {
          onPrevStep()
          setSwipeMessage("이전 페이지")
        } else {
          setSwipeMessage("첫 페이지 입니다")
        }
        break
      case "다음단계넘어가기":
        if (currentStep < totalPages - 1) {
          onNextStep()
          setSwipeMessage("다음 페이지")
        } else {
          setSwipeMessage("마지막 페이지 입니다")
        }
        break
      case "종료하기":
        console.log("종료합니다.")
        onClose()
        break
      case "타이머중지":
        setIsTimerRunning(false)
        setTimer(0)
        stopAlarm()
        console.log("타이머 중지 및 초기화")
        break
      case "타이머설정":
        const { seconds, minutes } = responseData
        const totalSeconds = minutes * 60 + seconds
        setTimer(totalSeconds)
        setIsTimerRunning(true)
        console.log(`타이머 설정: ${minutes}분 ${seconds}초`)
        break
      case "대체재료추천1":
        const alternatives1 = responseData.alternativeIngredients.join(", ")
        const recommendation1 = `다음 재료를 추천합니다: ${alternatives1}`
        console.log(recommendation1)
        speakText(recommendation1)
        break
      case "대체재료추천2":
        const alternatives2 = responseData.alternativeIngredients.join(", ")
        const recommendation2 = `다음 재료를 추천합니다: ${alternatives2}. ${responseData.message}`
        console.log(recommendation2)
        speakText(recommendation2)
        break
      default:
        console.log("알 수 없는 intent:", intent)
    }
  }

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
      const screenWidth = window.innerWidth
      const touchStartX = swipeTrackingRef.current.startX

      if (touchStartX > screenWidth / 2 && distance < 0) {
        if (currentStep < totalPages - 1) {
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
      minDetectionConfidence: 0.7,
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
    }

    return () => {
      if (camera) {
        camera.stop()
      }
    }
  }, [isTimerRunning, isAlarmPlaying]) // 타이머 상태와 알람 재생 상태를 의존성 배열에 추가

  if (!currentProcess) {
    return <div>No process available</div>
  }

  return (
    <div className="handpose-container3" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
      <video ref={videoRef} style={{ display: "none" }} autoPlay playsInline />
      <canvas ref={canvasRef} className="handpose-canvas" />
      <div className="card-div7">
        <div className="steps3">
          <div className="process-item3">
            <h2 className="steps-h23">
              <p>{currentStep}</p>
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
      {currentStep === totalPages - 1 && <div className="end-message">마지막 페이지 입니다</div>}
      <VoiceRecognitionComponent onRecognize={handleResponse} onStopAlarm={stopAlarm} recipeId={recipeId} token={token} />
    </div>
  )
}

HandPoseComponent.propTypes = {
  currentStep: PropTypes.number.isRequired,
  onNextStep: PropTypes.func.isRequired,
  onPrevStep: PropTypes.func.isRequired,
  recipe: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired, // Add onClose prop validation
}

export default HandPoseComponent
