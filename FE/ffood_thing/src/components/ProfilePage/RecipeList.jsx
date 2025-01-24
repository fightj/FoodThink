import React from "react";

const RecipeList = ({ recipes }) => {
  return (
    <div className="recipe-container">
      <div className="recipe-grid">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <img src={recipe.image} alt={recipe.title} className="recipe-image" />
            <p className="recipe-title">{recipe.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeList;
