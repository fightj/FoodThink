import React, { useEffect, useState } from "react"

const VoiceRecognitionComponent = ({ onRecognize, onStopAlarm, recipeId, token }) => {
  const [isRecordingModalVisible, setIsRecordingModalVisible] = useState(false)

  useEffect(() => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)()
    recognition.continuous = true
    recognition.interimResults = false

    const callFooding = ["하이푸딩", "하이, 푸딩", "푸딩", "하이 푸딩.", "하이 푸딩", "하이퍼딩", "하이프릴", "파이프딩", "hi 푸딩", "파이프팅", "푸딩아"]

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          const transcript = event.results[i][0].transcript.trim()
          console.log("인식된 텍스트:", transcript)

          if (callFooding.some((phrase) => transcript.toLowerCase().includes(phrase.toLowerCase()))) {
            console.log("하이 푸딩 인식")
            setIsRecordingModalVisible(true) // 녹음 모달을 보이도록 설정
            startRecording()
          }

          if (transcript.toLowerCase().includes("알람 꺼")) {
            console.log("알람 꺼 인식")
            onStopAlarm() // 알람 소리 멈추기
          }
        }
      }
    }

    recognition.start()

    let mediaRecorder
    let audioChunks = []

    const startRecording = () => {
      console.log("녹음 시작")
      audioChunks = [] // 새로운 녹음 파일 생성을 위해 초기화
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        mediaRecorder = new MediaRecorder(stream)
        mediaRecorder.start()

        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data)
        }

        mediaRecorder.onstop = () => {
          setIsRecordingModalVisible(false) // 녹음 모달을 숨기도록 설정
          const audioBlob = new Blob(audioChunks, { type: "audio/wav" })
          sendAudioToServer(audioBlob)
        }

        setTimeout(() => {
          mediaRecorder.stop()
        }, 5000) // 5초 녹음
      })
    }

    const sendAudioToServer = (audioBlob) => {
      const formData = new FormData()

      formData.append("file", audioBlob, "음성.wav") // 파일 이름을 지정하여 업로드
      formData.append("recipeId", recipeId) // 현재 레시피 아이디 전송
      fetch("https://i12e107.p.ssafy.io/api/speech/process", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("서버 응답 데이터:", data) // 서버 응답 데이터 콘솔 출력
          onRecognize(data) // 서버 응답 데이터 처리
          displayListeningMessage()
        })
        .catch((error) => {
          console.error("오류:", error)
        })
    }

    const displayListeningMessage = () => {
      console.log("Listening for commands...")
      setTimeout(displayListeningMessage, 10000) // 5초마다 메시지 출력
    }

    displayListeningMessage() // 초기 메시지 출력

    return () => {
      recognition.stop()
    }
  }, [recipeId, token, onStopAlarm, onRecognize])

  return (
    <div>
      {isRecordingModalVisible && (
        <div className="recording-modal">
          <img className="recording-gif" src="/images/record.gif" alt="Recording..." />
        </div>
      )}
    </div>
  )
}

export default VoiceRecognitionComponent
