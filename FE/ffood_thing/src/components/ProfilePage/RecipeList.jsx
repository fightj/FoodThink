import React, { useState, useEffect } from "react";
import "../../styles/ProfilePage.css"; // ✅ 스타일 파일 import

const getRandomColor = () => {
  const r = Math.floor(Math.random() * 200);
  const g = Math.floor(Math.random() * 200);
  const b = Math.floor(Math.random() * 200);
  return `rgb(${r}, ${g}, ${b})`;
};

const RecipeList = () => {
  const recipes = [
    { id: 1, title: "울리는 맛있는 라멘 🍜", image: "/images/recipe1.jpg" },
    { id: 2, title: "김치찌개가 힘들게 가르쳐준...", image: "/images/recipe2.jpg" },
    { id: 3, title: "비건짜장면 좋아보이네요...", image: "/images/recipe3.jpg" },
    { id: 4, title: "고기없는 떡볶이 🍢", image: "/images/recipe4.jpg" },
    { id: 5, title: "해장용 순두부찌개 🍲", image: "/images/recipe5.jpg" },
    { id: 6, title: "스테이크 샐러드 🥗", image: "/images/recipe6.jpg" },
  ];

  const [bookColors, setBookColors] = useState([]);

  useEffect(() => {
    setBookColors(Array.from({ length: recipes.length }, () => getRandomColor()));
  }, []);

  return (
    <div className="recipe-container">
      <div className="recipe-grid">
        {recipes.map((recipe, index) => (
          <div key={recipe.id} className="recipe-card" style={{ backgroundColor: bookColors[index] }}>
            <img src={recipe.image} alt={recipe.title} className="recipe-image" />
            <p className="recipe-title">{recipe.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeList;
