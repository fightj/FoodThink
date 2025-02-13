import React, { useState } from "react"
import "../../styles/recipe/RecipeInfo.css"
import HandTutorial from "./HandTutorial" // Ensure this path is correct

const RecipeInfo = ({ recipe, onBack }) => {
  const [showHandTutorial, setShowHandTutorial] = useState(false) // State to control which component to show

  if (!recipe) {
    return <div>Loading...</div>
  }

  console.log("Ingredients component rendered. showTutorial:", showHandTutorial)

  return (
    <div className="recipeInfo-container">
      {!showHandTutorial ? (
        <>
          <div className="recipeInfo-left info-left">
            <p>Recipe</p>
            <img src={recipe.image} alt="Recipe" className="recipe-image" />
          </div>
          <div className="recipeInfo-right info-right" onClick={() => setShowHandTutorial(true)}>
            <div className="recipe-details">
              <h1>{recipe.recipeTitle}</h1>
            </div>
            <div className="recipe-ingredients">
              <p>재료</p>
              <ul className="ingredients-list">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="ingredient-item">
                    {ingredient.ingreName}: {ingredient.amount}
                  </li>
                ))}
              </ul>
            </div>
            <button onClick={onBack} className="hidden-button1">
              이전
            </button>
            <button onClick={() => setShowHandTutorial(true)} className="hidden-button1">
              다음
            </button>
          </div>
        </>
      ) : (
        <HandTutorial recipe={recipe} onBack={() => setShowHandTutorial(false)} />
      )}
    </div>
  )
}

export default RecipeInfo
