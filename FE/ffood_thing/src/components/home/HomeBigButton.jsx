import React, { useState } from "react"
import "../../styles/home/HomeBigButton.css"
import { Link } from "react-router-dom"
import TodayRecommendModal from "./TodayRecommendModal" // 모달 컴포넌트 import
import "../../index.css"

const HomeBigButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false) // 모달 상태 관리

  return (
    <div className="card-div">
      <div className="row">
        <div className="col">
          {/* 왼쪽 열 */}
          <Link to="/recipes" className="card-link">
            <div className="card card-recipe" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), url(/images/비빔밥.jpg)`, opacity: 0.85 }}>
              <div className="content home">
                <h1>레시피</h1>
                <h4>수만가지 레시피를 확인해보세요.</h4>
              </div>
            </div>
          </Link>

          <Link to="/ai-recommend" className="card-link">
            <div className="card card-aiRecommend" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), url(/images/포케.jpg)`, opacity: 0.85 }}>
              <div className="content home">
                <h1>AI 음식 추천</h1>
                <h4>내 맞춤 음식 추천을 받아보세요.</h4>
              </div>
            </div>
          </Link>
        </div>

        <div className="col">
          {/* 오른쪽 열 */}
          <div
            className="card card-todayRecommend"
            style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), url(/images/피자.jpg)`, opacity: 0.85 }}
            onClick={() => setIsModalOpen(true)}
          >
            <div className="content home">
              <h1>오늘 뭐 먹지?</h1>
              <h4>오늘 먹을 음식을 추천받아보세요.</h4>
            </div>
          </div>

          <Link to="/sns" className="card-link">
            <div className="card card-sns" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), url(/images/메인페이지4.jpg)` }}>
              <div className="content home">
                <h1>SNS</h1>
                <h4>내가 만든 음식을 공유해봐요.</h4>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* 모달 컴포넌트 */}
      <TodayRecommendModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

export default HomeBigButton
