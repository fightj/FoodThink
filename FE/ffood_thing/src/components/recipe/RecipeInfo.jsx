import React from "react"
import "../../styles/recipe/RecipeInfo.css" // 스타일을 위한 CSS 파일을 임포트합니다.

const RecipeInfo = ({ recipe, onNextPage, onSkip }) => {
  if (!recipe) {
    return <div>Loading...</div>
  }

  const getLevelText = (level) => {
    switch (level) {
      case 1:
        return "하"
      case 2:
        return "중"
      case 3:
        return "상"
      default:
        return level
    }
  }

  return (
    <div className="recipeInfo-container">
      <div className="recipeInfo-left info-left">
        <img src={recipe.image} alt="Recipe" className="recipe-image" />
      </div>
      <div className="recipeInfo-right info-right">
        <h1>{recipe.recipeTitle}</h1>
        <h3>조리시간: {recipe.requiredTime}</h3>
        <h3>난이도: {getLevelText(recipe.level)}</h3>
        <h3>총 조리과정: {recipe.processes.length}</h3>
        <button onClick={onNextPage}>다음</button>
        <button onClick={onSkip}>스킵하기</button>
      </div>
    </div>
  )
}

export default RecipeInfo
