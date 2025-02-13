import React, { useState } from "react"
import "../../styles/recipe/Ingredients.css" // 스타일을 위한 CSS 파일을 임포트합니다.
import HandTutorial from "./HandTutorial" // Ensure this path is correct

const Ingredients = ({ recipe, onBack }) => {
  const [showHandTutorial, setShowHandTutorial] = useState(false) // State to control which component to show

  if (!recipe) {
    return <div>Loading...</div>
  }

  console.log("Ingredients component rendered. showTutorial:", showHandTutorial)

  return (
    <div className="ingredients-container">
      {!showHandTutorial ? (
        <>
          <h1>재료</h1>
          <ul>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>
                {ingredient.ingreName}: {ingredient.amount}
              </li>
            ))}
          </ul>
          <button onClick={onBack}>이전</button> {/* Back button */}
          <button onClick={() => setShowHandTutorial(true)}>다음</button> {/* Next button */}
        </>
      ) : (
        <HandTutorial recipe={recipe} onBack={() => setShowHandTutorial(false)} /> // Show Tutorial component and pass onBack function
      )}
    </div>
  )
}

export default Ingredients
