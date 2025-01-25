import React from "react";
import { Link } from "react-router-dom";

const RecipeList = ({ recipes }) => {
  return (
    <div className="recipe-container">
      <div className="recipe-grid">
        {recipes.map((recipe) => (
          <Link 
            to={`/recipes/${recipe.id}`} 
            key={recipe.id} 
            className="recipe-card" 
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <img src={recipe.image} alt={recipe.title} className="recipe-image" />
            <p className="recipe-title">{recipe.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecipeList;
