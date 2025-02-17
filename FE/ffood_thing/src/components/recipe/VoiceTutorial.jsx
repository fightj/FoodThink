import React, { useState, useEffect } from "react"
import "../../styles/recipe/VoiceTutorial.css" // 스타일을 위한 CSS 파일을 임포트합니다.

const VoiceTutorial = ({ onPrevPage, onNextPage, onSkip }) => {
  const [highlightStep, setHighlightStep] = useState(0) // 상태를 이용해 강조 단계 관리

  useEffect(() => {
    if (highlightStep >= 1) {
      onNextPage() // 하이라이트가 끝나면 자동으로 다음 페이지로 이동
    }
  }, [highlightStep, onNextPage])

  const handleHighlightStep = () => {
    setHighlightStep((prevStep) => prevStep + 1) // 다음 하이라이트 단계로 이동
  }

  // 인라인 스타일 정의
  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 1000,
  }

  const highlightStyle = {
    position: "relative",
    zIndex: 1001,
    backgroundColor: "none",
    padding: "10px",
    borderRadius: "5px",
  }

  return (
    <div className="voice-tutorial-container" onClick={handleHighlightStep}>
      <div className="voice-tutorial-left" onClick={onPrevPage}>
        <div className="voice-tutorial-info-left">
          <p>음성 인식</p>
          <p>이전 페이지</p>
          <p>다음 페이지</p>
          <p>현재 페이지 읽어주기</p>
          <p>재료 보기</p>
          <p>타이머 제어(설정, 시작, 중지)</p>
          <p>알람 끄기</p>
          <p>대체 재료 추천</p>
          <p>조리 종료</p>
        </div>
        <div className="voice-tutorial-info-right">
          <p>ex) "하이 푸딩"으로 시작</p>
          <p>ex) "이전 페이지로 넘어가줘"</p>
          <p>ex) "다음 페이지로 넘어가줘"</p>
          <p>ex) "현재 페이지 읽어줘"</p>
          <p>ex) "재료 보여줘"</p>
          <p>ex) "타이머 X분 X초 설정해줘"</p>
          <p>ex) "알람 꺼"</p>
          <p>ex) "~ 대신 ~ 어때?", "~ 대체 재료 추천해줘"</p>
          <p>ex) "요리 끝내줘"</p>
        </div>
      </div>
      <div className="voice-tutorial-right" onClick={onNextPage}>
        {highlightStep < 1 && <div style={overlayStyle}></div>} {/* 어두운 배경 */}
        <img className="speaking-mic-image" src="/images/mic.png" alt="mic" />
        <div className="speaking-div" style={highlightStyle}>
          <img src="/images/talking.gif" alt="Talking" className="speaking-gif" />
        </div>
      </div>
      <button className="hidden-button1" onClick={onNextPage}>
        다음
      </button>
      <button
        className="tuto-skip-button"
        style={{ zIndex: 1009, backgroundColor: "transparent", border: "none", padding: 0, position: "absolute", top: "5%", right: "2%", width: "5%" }}
        onClick={onSkip}
      >
        <img src="/images/skipbutton.png" alt="스킵하기" style={{ backgroundColor: "transparent", width: "100%", height: "auto" }} />
      </button>
      <button className="hidden-button1" onClick={onPrevPage}>
        이전
      </button>
    </div>
  )
}

export default VoiceTutorial
