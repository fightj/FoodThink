import React from "react"
import "../../styles/recipe/Tutorial.css" // 스타일을 위한 CSS 파일을 임포트합니다.

const Tutorial = () => {
  return (
    <div className="tutorial-container">
      <div className="left">
        <div className="left-top">
          <img src="/images/motion.gif" alt="Motion" />
        </div>
        <div className="left-bottom">
          <p>다음 화면 = 오른쪽에서 왼쪽으로 슬라이드</p>

          <p>이전 화면 = 왼쪽에서 오른쪽으로 슬라이드</p>
        </div>
      </div>
      <div className="right">
        <div className="right-top">
          <img src="/images/talking.gif" alt="Talking" />
        </div>
        <div className="right-bottom">
          <div className="right-bottom-left">
            <p>- 이전 페이지로 가줘!</p>
            <p>- 다음페이지로 가줘!</p>
            <p>- 타이머 1분 설정해줘!</p>
            <p>- 타이머 멈춰!</p>
          </div>
          <div className="right-bottom-right">
            <p>- xx 대체재료 추천해줘!</p>
            <p>- xx대신 xx으로 대체 가능해?</p>
            <p>- 현재 페이지 읽어줘!</p>
            <p>- 조리 끝내줘!</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tutorial
