import React, { useRef, useState, useEffect, useCallback } from "react"
import PropTypes from "prop-types"
import axios from "axios"
import "../../styles/recipe/RecipeComponent.css"
import GestureRecognition from "./GestureRecognition"
import VoiceRecognitionComponent from "../voice/VoiceRecognitionComponent"
import { useNavigate } from "react-router-dom"

const HandPoseComponent = ({ recipe, currentStep, onNextStep, onPrevStep, onClose, onNextPage }) => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const swipeTrackingRef = useRef({ startX: null, isTracking: false })
  const timerButtonRef = useRef(null) // 타이머 버튼에 대한 참조 추가
  const currentStepRef = useRef(currentStep) // currentStep에 대한 참조 추가
  const [swipeMessage, setSwipeMessage] = useState("")
  const [timer, setTimer] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const alarmAudioRef = useRef(new Audio("/sound/Alarm.wav"))
  const workerRef = useRef(null)

  const [currentProcess, setCurrentProcess] = useState({})
  const [isDataFetched, setIsDataFetched] = useState(false)
  const [spokenText, setSpokenText] = useState("")

  const token = localStorage.getItem("accessToken")
  const recipeId = recipe.recipeId
  const totalPages = recipe.processes.length

  const navigate = useNavigate()

  useEffect(() => {
    currentStepRef.current = currentStep // currentStep 업데이트
  }, [currentStep])

  const fetchProcessData = useCallback(
    async (recipeId, page) => {
      try {
        if (page >= totalPages) {
          onNextPage() // 총 페이지 수 이상이면 다음 페이지로 이동
          return
        }

        const response = await axios.get(`https://i12e107.p.ssafy.io/api/recipes/read/processes/${recipeId}/${page}`)
        const data = response.data
        const process = data.processes[0]
        setCurrentProcess(process)

        if (process.minutes !== 0 || process.seconds !== 0) {
          const totalSeconds = process.minutes * 60 + process.seconds
          setTimer(totalSeconds)
        }

        if (!isDataFetched) {
          setIsDataFetched(true)
        }
      } catch (error) {
        console.error("Error fetching process data:", error)
      }
    },
    [totalPages, onNextPage, isDataFetched]
  )

  useEffect(() => {
    fetchProcessData(recipeId, currentStep)
  }, [recipeId, currentStep, fetchProcessData])

  useEffect(() => {
    workerRef.current = new Worker(new URL("./timerWorker.js", import.meta.url))
    workerRef.current.onmessage = (e) => {
      if (e.data.type === "updateTimer") {
        setTimer(e.data.timer)
      } else if (e.data.type === "alarm") {
        playAlarm()
      } else if (e.data.type === "timerStopped") {
        setIsTimerRunning(false)
      }
    }

    return () => workerRef.current.terminate()
  }, [])

  const startTimer = () => {
    workerRef.current.postMessage({ type: "startTimer", timer })
    setIsTimerRunning(true)
  }

  const stopTimer = () => {
    workerRef.current.postMessage({ type: "stopTimer" })
    setTimer(0)
    setIsTimerRunning(false)
  }

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
    workerRef.current.postMessage({ type: "stopTimer" })
    alarmAudioRef.current.pause()
    alarmAudioRef.current.currentTime = 0
    setIsAlarmPlaying(false)
  }

  const changePage = useCallback(
    (direction) => {
      if (direction === "다음 페이지") {
        if (currentStepRef.current < totalPages - 1) {
          onNextStep()
        } else {
          setSwipeMessage("조리가 완료되었습니다")
          onNextPage()
        }
      } else if (direction === "이전 페이지") {
        if (currentStepRef.current > 0) {
          onPrevStep()
        } else {
          setSwipeMessage("첫 페이지 입니다")
        }
      }

      setTimeout(() => setSwipeMessage(""), 1000)
    },
    [onNextStep, onPrevStep, onNextPage, totalPages]
  )

  const speakText = (text) => {
    const synth = window.speechSynthesis
    const utterance = new SpeechSynthesisUtterance(text)
    synth.speak(utterance)
  }

  const handleResponse = useCallback(
    async (data) => {
      if (!data || typeof data !== "object") {
        console.error("Invalid data:", data)
        return
      }

      const { intent, data: responseData } = data
      console.log("Intent:", intent)
      console.log("Response Data:", responseData)

      if (!intent) {
        const errorMessage = responseData?.message || "Unknown error"
        console.log("에러 메시지:", errorMessage)
        speakText(errorMessage)
        setSpokenText(errorMessage)
        setTimeout(() => setSpokenText(""), 4000)
        return
      }

      console.log("saddsad", currentStepRef.current)
      console.log(recipe.processes[currentStepRef.current].processExplain)

      switch (intent) {
        case "현재단계읽기":
          const currentProcess = recipe.processes[currentStepRef.current] || { processExplain: "No text available" }
          const currentText = currentProcess.processExplain
          console.log("읽을 텍스트:", currentText)
          speakText(currentText)
          setSpokenText(currentText)

          const charReadingTime = 0.16 * 1000 // 글자당 0.14초 (1000ms)
          const displayTime = Math.max(currentText.length * charReadingTime, 4000) // 최소 4초

          setTimeout(() => setSpokenText(""), displayTime)
          break
        case "이전단계돌아가기":
          if (currentStepRef.current > 0) {
            onPrevStep()
            setSwipeMessage("이전 페이지")
          } else {
            setSwipeMessage("첫 페이지 입니다")
          }
          break
        case "다음단계넘어가기":
          if (currentStepRef.current < totalPages - 1) {
            onNextStep()
            setSwipeMessage("다음 페이지")
          } else {
            setSwipeMessage("마지막 페이지 입니다")
            onNextPage()
          }
          break
        case "종료하기":
          console.log("종료합니다.")
          navigate(`/recipes/${recipeId}`)
          break
        case "타이머중지":
          stopTimer()
          console.log("타이머 중지 및 초기화")
          break
        case "타이머설정":
          const { seconds, minutes } = responseData
          console.log(`타이머 설정 요청: ${minutes}분 ${seconds}초`)
          const totalSeconds = (minutes || 0) * 60 + (seconds || 0)
          setTimer(totalSeconds)
          setIsTimerRunning(false)
          console.log(`타이머 설정됨: ${totalSeconds}초`)
          break
        case "타이머시작":
          timerButtonRef.current.click() // 타이머 버튼 클릭
          break
        case "대체재료추천1":
          const alternatives1 = responseData.alternativeIngredients?.join(", ") || "No alternatives"
          const recommendation1 = ` 대체 제료로 ${alternatives1} 추천합니다!`
          console.log(recommendation1)
          speakText(recommendation1)
          setSpokenText(recommendation1)
          const charReadingTime2 = 0.16 * 1000 // 글자당 0.14초 (1000ms)
          const rec1DisplayTime = Math.max(recommendation1.length * charReadingTime2, 4000) // 최소 4초
          setTimeout(() => setSpokenText(""), rec1DisplayTime)
          break
        case "대체재료추천2":
          const alternatives2 = responseData.alternativeIngredients?.join(", ") || "No alternatives"
          const recommendation2 = `대체재료로 ${alternatives2} 추천합니다!. ${responseData.message || "No additional message"}`
          console.log(recommendation2)
          speakText(recommendation2)
          setSpokenText(recommendation2)
          const charReadingTime3 = 0.16 * 1000 // 글자당 0.14초 (1000ms)
          const rec2DisplayTime = Math.max(recommendation2.length * charReadingTime3, 4000) // 최소 4초
          setTimeout(() => setSpokenText(""), rec2DisplayTime)
          break
        case "재료보기":
          setIsSidebarOpen(true)
          break
        case "재료닫기":
          setIsSidebarOpen(false)
          break
        default:
          console.log("알 수 없는 intent:", intent)
      }

      setTimeout(() => setSwipeMessage(""), 1000)
    },
    [onNextStep, onPrevStep, onNextPage, stopTimer]
  )

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
        if (currentStepRef.current < totalPages - 1) {
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

  const handleTimerIconClick = () => {
    setIsTimerModalOpen(true)
  }

  const handleSetTimer = () => {
    const totalSeconds = minutes * 60 + seconds
    setTimer(totalSeconds)
    setIsTimerRunning(false)
    setIsTimerModalOpen(false)
  }

  const renderTimeline = () => {
    return (
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${((currentStepRef.current + 1) / totalPages) * 100}%` }}></div>
      </div>
    )
  }

  return (
    <div className="handpose-container3" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
      <GestureRecognition onChangePage={changePage} />
      <VoiceRecognitionComponent onRecognize={handleResponse} onStopAlarm={stopAlarm} recipeId={recipeId} token={token} />
      <video ref={videoRef} style={{ display: "none" }} autoPlay playsInline />
      <canvas ref={canvasRef} className="handpose-canvas" />

      {/* <div className="logo-timeline-container"> */}
      <div className="timeline-container">
        <img className="process-logo-img" src="/images/샤방이.png" alt="" />
        {renderTimeline()}
        <img className="process-exit-btn" src="/images/exit-btn.png" alt="" onClick={onClose} />
      </div>
      <div className="process-item3">
        <h2 className="steps-h23">{currentProcess.processExplain}</h2>
      </div>

      <div className="content-image-container">
        <div className="process-image-container3">
          {currentProcess.images &&
            currentProcess.images.map((image, imgIndex) => <img key={imgIndex} src={image.imageUrl} alt={`Process ${currentProcess.processOrder}`} className="process-image3" />)}
        </div>
      </div>

      <div className="ing-time-container">
        <div className="ingredient-container">
          <button className="ingredient-button" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <img src="/images/ingredient-btn.png" alt="" />
          </button>
        </div>
        <div className="timer-container">
          <button className="timer-button" onClick={handleTimerIconClick}>
            <img className="timer-image3" src={isTimerRunning ? "/images/do-timer.gif" : "/images/undo-timer.png"} alt="Timer" />
          </button>
        </div>
      </div>

      {swipeMessage && <div className="swipe-message">{swipeMessage}</div>}
      <div className="timer3">
        {String(Math.floor(timer / 60)).padStart(2, "0")}:{String(timer % 60).padStart(2, "0")}
        <button ref={timerButtonRef} onClick={isTimerRunning ? stopTimer : startTimer} disabled={timer === 0} style={{ border: "none", background: "none", padding: "0" }}>
          <img src={isTimerRunning ? "/images/timer-stop-btn.png" : "/images/timer-start-btn.png"} alt={isTimerRunning ? "타이머 정지" : "타이머 시작"} className="timer-button-image" />
        </button>
      </div>
      {currentStep === totalPages - 1 && <div className="end-message">마지막 페이지 입니다</div>}
      {currentStep === totalPages - 1 && (
        <button className="end-cooking-btn" onClick={onNextPage}>
          조리 끝내기
        </button>
      )}
      {isSidebarOpen && (
        <div className="ingredient-sidebar open">
          <ul>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>
                {ingredient.ingreName}: {ingredient.amount}
              </li>
            ))}
          </ul>
        </div>
      )}
      {spokenText && <div className="spoken-text">{spokenText}</div>}
      {isTimerModalOpen && (
        <div className="timer-modal">
          <div className="slider-container">
            <div className="slider-wrapper">
              <div className="slider">
                <input type="range" min="0" max="59" value={minutes} onChange={(e) => setMinutes(parseInt(e.target.value) || 0)} className="range-slider vertical-slider" />
              </div>
              <div className="slider-label">분: {minutes}</div>
            </div>
            <div className="slider-wrapper">
              <div className="slider">
                <input type="range" min="0" max="59" value={seconds} onChange={(e) => setSeconds(parseInt(e.target.value) || 0)} className="range-slider vertical-slider" />
              </div>
              <div className="slider-label">초: {seconds}</div>
            </div>
          </div>
          <div className="timer-btn-area">
            <button className="timer-modal-btn" onClick={handleSetTimer}>
              설정
            </button>
            <button className="timer-modal-btn" onClick={() => setIsTimerModalOpen(false)}>
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

HandPoseComponent.propTypes = {
  currentStep: PropTypes.number.isRequired,
  onNextStep: PropTypes.func.isRequired,
  onPrevStep: PropTypes.func.isRequired,
  recipe: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onNextPage: PropTypes.func.isRequired,
}

export default HandPoseComponent
