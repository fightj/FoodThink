import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 useNavigate 추가
import "../../styles/recommend/TodayRecommendModal.css";
import todayRecipeData from "../../data/TodayRecipeData"; // 더미 데이터

const TodayRecommendModal = ({ isOpen, onClose }) => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수

  // 모달이 열릴 때마다 랜덤 레시피 선택
  useEffect(() => {
    if (isOpen) {
      const randomIndex = Math.floor(Math.random() * todayRecipeData.length);
      setSelectedRecipe(todayRecipeData[randomIndex]);
    }
  }, [isOpen]);

  if (!isOpen) return null; // 모달이 닫혀 있으면 렌더링 안 함
  if (!selectedRecipe) return <p className="loading-text">로딩 중...</p>;

  // 이미지 클릭 시 상세 페이지로 이동
  const goToDetailPage = () => {
    navigate(`/recipes/${selectedRecipe.id}`); // 상세 페이지로 이동
    onClose(); // 모달 닫기
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="today-recommend-card" onClick={(e) => e.stopPropagation()}>
        <h2>오늘 뭐 먹지? 🍽️</h2>
        <img
          src={selectedRecipe.image}
          alt={selectedRecipe.title}
          className="recipe-image"
          onClick={goToDetailPage} // 이미지 클릭 시 상세 페이지 이동
          style={{ cursor: "pointer" }} // 마우스 오버 시 클릭 가능하게 변경
        />
        <p className="recipe-title">{selectedRecipe.title}</p>
        <p className="recipe-description">{selectedRecipe.description || "맛있는 요리를 추천해드려요!"}</p>
        <button className="close-btn" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default TodayRecommendModal;
