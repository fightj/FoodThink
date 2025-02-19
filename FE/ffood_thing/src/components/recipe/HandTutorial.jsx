import React from "react"
import "../../styles/recipe/HandTutorial.css"

const HandTutorial = ({ onPrevPage, onNextPage, onSkip }) => {
  return (
    <div className="hand-tutorial-container">
      <button className="arrow-button prev-arrow" onClick={onPrevPage}>
        <img src="/images/arrow2.png" alt="PrevButton" />
      </button>
      <button className="arrow-button next-arrow" onClick={onNextPage}>
        <img src="/images/arrow.png" alt="NextButton" />
      </button>
      <button className="handtuto-skip-button" onClick={onSkip}>
      🚀 건너뛰기
      </button>
    </div>
  )
}

export default HandTutorial
