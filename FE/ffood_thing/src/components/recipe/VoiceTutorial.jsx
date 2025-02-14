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
        <div className="voice-tutorial-info">
          <p>음성 인식 = "하이 푸딩"으로 시작</p>
          <p>알람 끄기 = "알람 꺼"</p>
          {/* 추가적인 음성 인식 정보 */}
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
        style={{ zIndex: 1009, backgroundColor: "transparent", border: "none", padding: 0, position: "absolute", top: "5%", right: "2%", width: "5%" }} // 항상 스킵 버튼을 누를 수 있도록 z-index 조정
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
