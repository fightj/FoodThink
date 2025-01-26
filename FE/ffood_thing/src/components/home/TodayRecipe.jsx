import React, { useState, useEffect, useRef } from "react";
import todayRecipeData from "../../data/todayRecipeData"; // ✅ 더미 데이터 가져오기
import "../../styles/home/TodayRecipe.css"; // ✅ 스타일 파일 추가

const TodayRecipe = ({ onClose }) => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const modalRef = useRef(null);

  // ✅ 랜덤 레시피 선택
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * todayRecipeData.length);
    setSelectedRecipe(todayRecipeData[randomIndex]);
  }, []);

  // ✅ 모달 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!selectedRecipe) return null; // ✅ 데이터 로드 전에는 아무것도 렌더링하지 않음

  return (
    <>
      {/* ✅ 배경 어둡게 */}
      <div className="modal-backdrop" onClick={onClose}></div>

      {/* ✅ 모달창 */}
      <div className="today-recipe-modal" ref={modalRef}>
        <h2>오늘의 추천 메뉴</h2>
        <img src={selectedRecipe.image} alt={selectedRecipe.title} className="recipe-image" />
        <p className="recipe-title">{selectedRecipe.title}</p>
        <button className="close-btn" onClick={onClose}>닫기</button>
      </div>
    </>
  );
};

export default TodayRecipe;
