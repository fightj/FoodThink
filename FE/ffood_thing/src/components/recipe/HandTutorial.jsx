import React, { useState, useEffect } from "react"
import "../../styles/recipe/HandTutorial.css"

const HandTutorial = ({ onPrevPage, onNextPage, onSkip }) => {
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
    <div className="hand-tutorial-container" onClick={handleHighlightStep}>
      <header className="hand-tutorial-header">
        <h1>카메라에 손을 스와이프하여 페이지를 넘겨보세요!</h1>
      </header>
      <div className="hand-tutorial-left-right">
        <div className="hand-tutorial-left">
          {highlightStep < 1 && <div style={overlayStyle}></div>} {/* 어두운 배경 */}
          <img src="/images/camera.png" alt="Motion" className="tablet-image" />
          <div className="handmotion-div" style={highlightStyle}>
            <img src="/images/motion2.gif" alt="Motion" className="handmotion-gif" />
          </div>
        </div>
        <div className="hand-tutorial-right">
          <img src="/images/camera.png" alt="Motion" className="tablet-image" />
          <div className="handmotion-div" style={highlightStyle}>
            <img src="/images/motion.gif" alt="Motion" className="handmotion-gif" />
          </div>
          <div className="speaking-info-div"></div>
          <button className="hidden-button1" onClick={onPrevPage}>
            이전
          </button>
          <button className="hidden-button1" onClick={onNextPage}>
            다음
          </button>
        </div>
        <button
          className="tuto-skip-button"
          style={{ zIndex: 1002 }} // 항상 스킵 버튼을 누를 수 있도록 z-index 조정
          onClick={onSkip}
        >
          스킵하기
        </button>
      </div>
    </div>
  )
}

export default HandTutorial
