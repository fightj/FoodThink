import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import todayRecipeData from "../../data/todayRecipeData"; // 더미 데이터
import "../../styles/recommend/TodayRecommendPage.css";

function TodayRecommendPage() {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const navigate = useNavigate(); // 뒤로 가기 기능

  // 랜덤 레시피 선택
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * todayRecipeData.length);
    setSelectedRecipe(todayRecipeData[randomIndex]);
  }, []);

  if (!selectedRecipe) return <p className="loading-text">로딩 중...</p>; // 데이터 로드 전 로딩 표시

  return (
    <div className="today-recommend-container">
      <div className="today-recommend-card">
        <h2>오늘 뭐 먹지? 🍽️</h2>
        <img src={selectedRecipe.image} alt={selectedRecipe.title} className="recipe-image" />
        <p className="recipe-title">{selectedRecipe.title}</p>
        <button className="back-btn" onClick={() => navigate(-1)}>뒤로 가기</button> {/* 뒤로 가기 버튼 */}
      </div>
    </div>
  );
}

export default TodayRecommendPage;
