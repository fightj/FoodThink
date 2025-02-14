import React, { useState } from "react"
import "../../styles/recipe/Welcome.css"
import RecipeInfo from "./RecipeInfo" // Ensure this path is correct

const Welcome = ({ recipe, onNextPage, onPrevPage }) => {
  return (
    <div className="welcome-container">
      <button className="start-button" onClick={onNextPage}>
        요리 시작
      </button>
      <img src="/images/knife.png" alt="knife" />
      <img src="/images/bubblemaker.png" alt="bubblemaker" />
    </div>
  )
}

export default Welcome
