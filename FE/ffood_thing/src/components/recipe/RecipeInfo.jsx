import React from "react"
import "../../styles/recipe/RecipeInfo.css" // 스타일을 위한 CSS 파일을 임포트합니다.

const RecipeInfo = () => {
  return (
    <div className="recipeInfo-container">
      <div className="recipeInfo-left info-left">왼쪽</div>
      <div className="recipeInfo-right info-right">오른쪽</div>
    </div>
  )
}

export default RecipeInfo
