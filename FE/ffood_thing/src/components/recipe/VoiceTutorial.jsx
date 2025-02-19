import React from "react"
import "../../styles/recipe/VoiceTutorial.css"

const VoiceTutorial = ({ onPrevPage, onNextPage, onSkip }) => {
  return (
    <div className="voice-tutorial-container">
      <button className="arrow-button prev-arrow" onClick={onPrevPage}>
        <img src="/images/arrow2.png" alt="PrevButton" />
      </button>
      <button className="arrow-button next-arrow" onClick={onNextPage}>
        <img src="/images/arrow.png" alt="NextButton" />
      </button>
      <button className="voicetuto-skip-button" onClick={onSkip}>
        🚀스킵하기
      </button>
    </div>
  )
}

export default VoiceTutorial
