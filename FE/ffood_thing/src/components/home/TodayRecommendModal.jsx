import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/recommend/TodayRecommendModal.css";
import todayRecipeData from "../../data/TodayRecipeData";

const TodayRecommendModal = ({ isOpen, onClose }) => {
  const [activeIndex, setActiveIndex] = useState(1); // 중앙 카드 인덱스
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // 📌 음식 선택 시 검색 결과 페이지로 이동 (중앙 카드 클릭 시)
  const goToSearchPage = (recipeTitle) => {
    navigate(`/search?query=${encodeURIComponent(recipeTitle)}`);
    onClose();
  };

  // 📌 클릭한 카드를 중앙으로 이동시키는 함수
  const moveToCenter = (index) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="today-recommend-card" onClick={(e) => e.stopPropagation()}>
        <h2>오늘 뭐 먹지? 🍽️</h2>
        <div className="carousel">
          <div className="recipe-list" style={{ transform: `translateX(${-activeIndex * 10}px)` }}>
            {todayRecipeData.slice(0, 3).map((recipe, i) => (
              <div
                key={i}
                className={`recipe-item ${i === activeIndex ? "active" : ""}`}
                onClick={() => (i === activeIndex ? goToSearchPage(recipe.title) : moveToCenter(i))}
              >
                <img src={recipe.image} alt={recipe.title} className="recipe-image" />
                {i === activeIndex && <p className="recipe-title">{recipe.title}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodayRecommendModal;
