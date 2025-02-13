import React from "react"
import "../../styles/recipe/VoiceTutorial.css" // 스타일을 위한 CSS 파일을 임포트합니다.

const VoiceTutorial = ({ onBack }) => {
  return (
    <div className="voice-tutorial-container">
      <div className="voice-tutorial-left" onClick={onBack}>
        <div className="voice-tutorial-info">
          <p>음성 인식 = "하이 푸딩"으로 시작</p>
          <p>알람 끄기 = "알람 꺼"</p>
          {/* 추가적인 음성 인식 정보 */}
        </div>
      </div>
      <div className="voice-tutorial-right">
        <div className="voice-tutorial-gif">
          <img src="/images/voice.gif" alt="Voice" className="voice-gif" />
        </div>
      </div>

      <button className="hidden-button1" onClick={onBack}>
        이전
      </button>
    </div>
  )
}

export default VoiceTutorial
