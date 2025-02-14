import React, { useState } from "react"
import "../../styles/recipe/Welcome.css"
import RecipeInfo from "./RecipeInfo" // Ensure this path is correct

const Welcome = ({ recipe, onNextPage, onPrevPage }) => {
  return (
    <div className="welcome-container">
      <h1>환영합니다!</h1>
      <p>저희 사이트에 오신 것을 환영합니다. 여기서 여러분은 다양한 요리를 즐길 수 있습니다.</p>
      <button className="start-button" onClick={onNextPage}>
        요리 시작
      </button>
    </div>
  )
}

export default Welcome
