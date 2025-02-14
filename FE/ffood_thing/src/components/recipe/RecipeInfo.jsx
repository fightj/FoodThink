import React, { useState } from "react"
import "../../styles/recipe/RecipeInfo.css"
import HandTutorial from "./HandTutorial" // Ensure this path is correct

const RecipeInfo = ({ recipe, onNextPage }) => {
  if (!recipe) {
    return <div>Loading...</div>
  }

  return (
    <div className="recipeInfo-container">
      <div className="recipeInfo-left info-left">
        <p>Recipe</p>
        <img src={recipe.image} alt="Recipe" className="recipe-image" />
      </div>
      <div className="recipeInfo-right info-right" onClick={onNextPage}>
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

        <button onClick={onNextPage} className="hidden-button1">
          다음
        </button>
      </div>
    </div>
  )
}

export default RecipeInfo
