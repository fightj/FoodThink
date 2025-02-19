import React from "react"
import "../../styles/recipe/RecipeInfo.css"
import HandTutorial from "./HandTutorial" // Ensure this path is correct

const RecipeInfo = ({ recipe, onNextPage }) => {
  if (!recipe) {
    return <div>Loading...</div>
  }
  console.log(recipe)

  return (
    <div className="card-div-info">
      <div className="recipeInfo-container">
        <header>
          <div className="info-badge-div">
            <img src="/images/후라이팬.gif" alt="후라이팬" />
          </div>
          <div className="recipe-info-details">
            <h1>{recipe.recipeTitle}</h1>
          </div>
        </header>
        <div className="recipe-left-right">
          <div className="recipeInfo-left info-left">
            <img src={recipe.image} alt="Recipe" className="recipe-image" />
          </div>
          <div className="recipeInfo-right info-right" onClick={onNextPage}>
            <div className="recipe-ingredients">
              <p>재료🥕</p>
              <ul className="info-ingredients-list">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="info-ingredient-item">
                    {ingredient.ingreName}: {ingredient.amount}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button onClick={onNextPage} className="hidden-button1">
            다음
          </button>
        </div>
      </div>
    </div>
  )
}

export default RecipeInfo
