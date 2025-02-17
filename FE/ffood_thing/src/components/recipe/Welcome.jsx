import React from "react"
import "../../styles/recipe/Welcome.css"
import RecipeInfo from "./RecipeInfo" // Ensure this path is correct

const Welcome = ({ recipe, onNextPage, onPrevPage }) => {
  return (
    <div className="card-div-welcome">
      <div className="welcome-container" onClick={onNextPage}>
        <div className="welcome-comment">
          <h1 className="start-title">🍽 푸딩이랑 요리하기</h1>
          <img className="cooking-image-welcome" src="/images/샤방이.png" alt="" />
        </div>
        <div className="ready-for-cooking">
          <p>시작하기</p>
        </div>
      </div>
    </div>
  )
}

export default Welcome
