import React, { useState } from "react"
import "../../styles/recipe/HandTutorial.css" // 스타일을 위한 CSS 파일을 임포트합니다.
import VoiceTutorial from "./VoiceTutorial" // Ensure this path is correct

const HandTutorial = ({ recipe, onBack }) => {
  const [showVoiceTutorial, setShowVoiceTutorial] = useState(false) // State to control which component to show

  if (!recipe) {
    return <div>Loading...</div>
  }

  if (showVoiceTutorial) {
    return <VoiceTutorial onBack={() => setShowVoiceTutorial(false)} />
  }

  return (
    <div className="tutorial-container">
      <div className="tutorial-left">
        <div className="handmotion-div">
          <img src="/images/motion.gif" alt="Motion" className="handmotion-gif" />
        </div>
        <div className="handmotion-info-div">
          <p>다음 화면 = 오른쪽에서 왼쪽으로 슬라이드</p>
          <p>이전 화면 = 왼쪽에서 오른쪽으로 슬라이드</p>
        </div>
      </div>
      <div className="tutorial-right">
        <div className="speaking-div">
          <img src="/images/talking.gif" alt="Talking" className="speaking-gif" />
        </div>
        <div className="speaking-info-div">{/* Add any additional tutorial info here */}</div>
      </div>
      <button onClick={onBack}>이전</button> {/* Back button */}
      <button onClick={() => setShowVoiceTutorial(true)}>다음</button> {/* Next button */}
    </div>
  )
}

export default HandTutorial
