import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/recommend/TodayRecommendModal.css";
import { FaRedo } from "react-icons/fa";

const API_URL = "https://i12e107.p.ssafy.io/api/today-recommend/random";

const TodayRecommendModal = ({ isOpen, onClose }) => {
  const [activeIndex, setActiveIndex] = useState(1); // 중앙 카드 인덱스
  const [selectedRecipes, setSelectedRecipes] = useState([]); // API에서 가져올 데이터
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      // 📌 로컬 스토리지에서 기존 추천 데이터를 가져오기
      const storedRecipes = localStorage.getItem("todaySelectedRecipes");
      if (storedRecipes) {
        setSelectedRecipes(JSON.parse(storedRecipes));
      } else {
        fetchTodayRecommendations();
      }

      document.body.style.overflow = "hidden"; // 배경 스크롤 방지
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // 📌 API에서 오늘의 추천 레시피 가져오기
  const fetchTodayRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`서버 응답 오류: ${response.status}`);
      
      const data = await response.json();
      console.log("📌 오늘의 추천 레시피 데이터:", data);

      if (Array.isArray(data) && data.length === 3) {
        setSelectedRecipes(data);
        localStorage.setItem("todaySelectedRecipes", JSON.stringify(data)); // 로컬 저장
      } else {
        throw new Error("추천 레시피 데이터가 올바르지 않습니다.");
      }
    } catch (error) {
      console.error("❌ 오늘의 추천 레시피 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || selectedRecipes.length < 3) return null; // 데이터가 준비되지 않았을 때 렌더링 방지

  // 📌 레시피 상세 페이지로 이동 (중앙 카드 클릭 시)
  const goToRecipeDetail = (recipeId) => {
    navigate(`/recipes/${recipeId}`);
    onClose();
  };

  // 📌 클릭한 카드를 중앙으로 이동시키는 함수
  const moveToCenter = (index) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  // 📌 새로고침 버튼 클릭 시, 기존 데이터 삭제 후 새로운 추천 받기
  const refreshRecommendations = () => {
    localStorage.removeItem("todaySelectedRecipes"); // 저장된 데이터 삭제
    fetchTodayRecommendations(); // 새로운 데이터 요청
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="today-recommend-card" onClick={(e) => e.stopPropagation()}>
        {/* 닫기 버튼 */}
        <button className="today-close-btn" onClick={onClose}>×</button>
        
        {/* 새로고침 버튼 */}
        <button className="refresh-btn" onClick={refreshRecommendations} disabled={loading}>
          <FaRedo />
        </button>
        
        <div className="today-title">오늘 뭐 먹지? 🍽️</div>

        {loading ? (
          <div className="loading-text">추천받는 중...</div>
        ) : (
          <div className="today-carousel">
            <div className="recipe-list" style={{ transform: `translateX(${-activeIndex * 10}px)` }}>
              {selectedRecipes.map((recipe, i) => (
                <div
                  key={recipe.recipeId}
                  className={`recipe-item ${i === activeIndex ? "active" : ""}`}
                  onClick={() => (i === activeIndex ? goToRecipeDetail(recipe.recipeId) : moveToCenter(i))}
                >
                  <img src={recipe.image} alt={recipe.recipeTitle} className="recipe-image" />
                  {i === activeIndex && <p className="recipe-title-main">{recipe.recipeTitle}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodayRecommendModal;
