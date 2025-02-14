import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/recommend/TodayRecommendModal.css";
import { FaRedo } from "react-icons/fa";

const API_URL = "https://i12e107.p.ssafy.io/api/today-recommend/random";

const TodayRecommendModal = ({ isOpen, onClose }) => {
  const [activeIndex, setActiveIndex] = useState(1);
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      const storedRecipes = localStorage.getItem("todaySelectedRecipes");
      if (storedRecipes) {
        setSelectedRecipes(JSON.parse(storedRecipes));
      } else {
        fetchTodayRecommendations();
      }
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const fetchTodayRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`서버 응답 오류: ${response.status}`);
      const data = await response.json();
      if (Array.isArray(data) && data.length === 3) {
        setSelectedRecipes(data);
        localStorage.setItem("todaySelectedRecipes", JSON.stringify(data));
      } else {
        throw new Error("추천 레시피 데이터가 올바르지 않습니다.");
      }
    } catch (error) {
      console.error("❌ 오늘의 추천 레시피 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || selectedRecipes.length < 3) return null;

  const goToRecipeDetail = (recipeId) => {
    navigate(`/recipes/${recipeId}`);
    onClose();
  };

  // const moveToCenter = (index) => {
  //   if (index !== activeIndex) {
  //     setActiveIndex(index);
  //   }
  // };

  const refreshRecommendations = () => {
    localStorage.removeItem("todaySelectedRecipes");
    fetchTodayRecommendations();
  };
  const moveToCenter = (index) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
  
      // Calculate the offset to center the selected card
      const offset = (index - Math.floor(selectedRecipes.length / 2)) * -300; // Adjust `300` based on card width
      const listElement = document.querySelector(".today-recipe-list");
      if (listElement) {
        listElement.style.transform = `translateX(${offset}px)`; // Smooth movement
      }
    }
  };
  
  

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="today-recommend-card" onClick={(e) => e.stopPropagation()}>
        <button className="today-close-btn" onClick={onClose}>
          <img src="/images/close_icon.png" alt="닫기" />
        </button>
        <button className="refresh-btn" onClick={refreshRecommendations} disabled={loading}>
          <img src="/images/rotate_right.png" alt="새로고침" />
        </button>
        <div className="today-title">오늘 뭐 먹지? 🍽️</div>
        {loading ? (
          <div className="loading-text"><img src="/src/assets/icon/loading.png" alt="추천받는 중..." className="rotating-image"/></div>
        ) : (
          <>
            <div className="today-carousel">
              <div className="today-recipe-list">
                {selectedRecipes.map((recipe, i) => (
                  <div
                    key={recipe.recipeId}
                    className={`today-recipe-item ${i === activeIndex ? "active" : ""}`}
                    onClick={() => (i === activeIndex ? goToRecipeDetail(recipe.recipeId) : moveToCenter(i))}
                  >
                    <img src={recipe.image} alt={recipe.recipeTitle} className="recipe-image" />
                  </div>
                ))}
              </div>
            </div>
            <div className="recipe-title-container">
              <p className="recipe-title-main">{selectedRecipes[activeIndex].recipeTitle}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TodayRecommendModal;
