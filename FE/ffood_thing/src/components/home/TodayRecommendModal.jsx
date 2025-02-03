import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/recommend/TodayRecommendModal.css";
import todayRecipeData from "../../data/TodayRecipeData"; // 더미 데이터

const TodayRecommendModal = ({ isOpen, onClose }) => {
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const navigate = useNavigate();

  // 모달이 열릴 때마다 3개의 랜덤 레시피 선택 + 배경 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      const shuffled = [...todayRecipeData].sort(() => 0.5 - Math.random()); // 배열을 랜덤 정렬
      setSelectedRecipes(shuffled.slice(0, 3)); // 랜덤으로 3개 선택

      // 📌 배경 스크롤 방지
      document.body.style.overflow = "hidden";
    } else {
      // 📌 모달이 닫히면 원래대로 스크롤 가능
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null; // 모달이 닫혀 있으면 렌더링 안 함
  if (!selectedRecipes.length) return <p className="loading-text">로딩 중...</p>;

  // 📌 음식 선택 시 검색 결과 페이지로 이동
  const goToSearchPage = (recipeTitle) => {
    navigate(`/search?query=${encodeURIComponent(recipeTitle)}`); // 검색 페이지로 이동
    onClose(); // 모달 닫기
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="today-recommend-card" onClick={(e) => e.stopPropagation()}>
        <h2>오늘 뭐 먹지? 🍽️</h2>
        <div className="recipe-list">
          {selectedRecipes.map((recipe, index) => (
            <div key={index} className="recipe-item" onClick={() => goToSearchPage(recipe.title)}>
              <img src={recipe.image} alt={recipe.title} className="recipe-image" />
              <p className="recipe-title">{recipe.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodayRecommendModal;
