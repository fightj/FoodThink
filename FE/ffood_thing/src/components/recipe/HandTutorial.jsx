import React from "react"
import "../../styles/recipe/HandTutorial.css" // 스타일을 위한 CSS 파일을 임포트합니다.

const HandTutorial = ({ onPrevPage, onNextPage, onSkip }) => {
  return (
    <div className="hand-tutorial-container">
      <div className="hand-tutorial-left" onClick={onPrevPage}>
        <div className="handmotion-div">
          <img src="/images/motion.gif" alt="Motion" className="handmotion-gif" />
        </div>
        <div className="handmotion-info-div">
          <p>다음 화면 = 오른쪽에서 왼쪽으로 슬라이드</p>
          <p>이전 화면 = 왼쪽에서 오른쪽으로 슬라이드</p>
        </div>
      </div>
      <div className="hand-tutorial-right" onClick={onNextPage}>
        <div className="speaking-div">
          <img src="/images/talking.gif" alt="Talking" className="speaking-gif" />
        </div>
        <div className="speaking-info-div">{/* Add any additional tutorial info here */}</div>
        <button className="hidden-button1" onClick={onPrevPage}>
          이전
        </button>{" "}
        {/* Back button */}
        <button className="hidden-button1" onClick={onNextPage}>
          다음
        </button>{" "}
        {/* Next button */}
      </div>
      <button onClick={onSkip}>스킵하기</button> {/* Skip button */}
    </div>
  )
}

export default HandTutorial
