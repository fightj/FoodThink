import React from "react";
import "../../styles/recipe/Tutorial.css"; // 스타일을 위한 CSS 파일을 임포트합니다.

const Tutorial = ({ recipe, onBack }) => {
  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div className="tutorial-container">
      <div className="tutorial-left">
        <div className="handmotion-div">
          <img src="/images/motion.gif" alt="Motion" className="handmotion-gif"/>
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
        <div className="speaking-info-div">
          {/* Add any additional tutorial info here */}
        </div>
      </div>
      <button onClick={onBack}>이전</button> {/* Back button */}
    </div>
  );
};

export default Tutorial;
