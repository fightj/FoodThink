import React, { useState } from "react";
import "../../styles/recipe/RecipeInfo.css"; // 스타일을 위한 CSS 파일을 임포트합니다.
import Ingredients from "./Ingredients"; // Ensure this path is correct

const RecipeInfo = ({ recipe }) => {
  const [showIngredients, setShowIngredients] = useState(false); // State to control which component to show

  if (!recipe) {
    return <div>Loading...</div>;
  }

  console.log("RecipeInfo component rendered. showIngredients:", showIngredients);
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
      {!showIngredients ? ( // Conditionally render based on the state
        <>
          <div className="recipeInfo-left info-left">
            <img src={recipe.image} alt="Recipe" className="recipe-image" />
          </div>
          <div className="recipeInfo-right info-right">
            <h1>{recipe.recipeTitle}</h1>
            <h3>조리시간: {recipe.requiredTime}</h3>
            <h3>난이도: {getLevelText(recipe.level)}</h3>
            <h3>총 조리과정: {recipe.processes.length}</h3>
            <button onClick={() => {
              console.log("Next button clicked");
              setShowIngredients(true);
            }}>다음</button>
          </div>
        </>
      ) : (
        <Ingredients recipe={recipe} onBack={() => setShowIngredients(false)} /> // Pass the onBack function as a prop
      )}
    </div>
  );
};

export default RecipeInfo;
