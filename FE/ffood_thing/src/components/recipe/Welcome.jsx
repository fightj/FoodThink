import React, { useState } from "react"
import "../../styles/recipe/Welcome.css"
import RecipeInfo from "./RecipeInfo" // Ensure this path is correct

const Welcome = ({ recipe, onNextPage, onPrevPage }) => {
  return (
    <div className="welcome-container" onClick={onNextPage}>
      <img className="cooking-image-welcome" src="/images/cooking-image.png" alt="cooking-image" />
      <div className="welcome-comment">
        <p>푸띵과 함께 쉽게 요리해요!</p>
      </div>
      <div className="ready-for-cooking">
        <p>요리를 시작하려면 화면을 터치하세요.</p>
      </div>

    </div>
  )
}

export default Welcome
