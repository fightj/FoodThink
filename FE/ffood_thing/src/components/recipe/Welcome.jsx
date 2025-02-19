import React from "react"
import "../../styles/recipe/Welcome.css"
import RecipeInfo from "./RecipeInfo" // Ensure this path is correct

const Welcome = ({ recipe, onNextPage, onPrevPage }) => {
  return (
    <div className="card-div-welcome">
      <div className="welcome-container">
        <h1 className="welcome-start-title">🍽 푸딩이랑 요리하기</h1>
        <img className="cooking-image-welcome" src="/images/샤방이.png" alt="" />
        <p className="mode-change-message">가로 모드를 실행해주세요</p>
        <button className="ready-for-cooking-button" onClick={onNextPage}>
          시작하기 🍽
        </button>
      </div>
    </div>
  )
}

export default Welcome
