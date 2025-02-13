import React from "react"
import "../../styles/recipe/Ingredients.css" // 스타일을 위한 CSS 파일을 임포트합니다.

const Ingredients = ({ recipe, onNextStep, onBack, onSkip }) => {
  if (!recipe) {
    return <div>Loading...</div>
  }

  return (
    <div className="ingredients-container">
      <h1>현재 페이지: 1</h1>
      <h1>재료</h1>
      <ul>
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>
            {ingredient.ingreName}: {ingredient.amount}
          </li>
        ))}
      </ul>
      <button onClick={onBack}>이전</button> {/* Back button */}
      <button onClick={onNextStep}>다음</button> {/* Next button */}
      <button onClick={onSkip}>스킵하기</button> {/* Skip button */}
    </div>
  )
}

export default Ingredients
