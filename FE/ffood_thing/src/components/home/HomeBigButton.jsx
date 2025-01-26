import React, { useState } from "react";
import "../../styles/home/HomeBigButton.css";
import TodayRecipe from "./TodayRecipe.jsx"; // ✅ 새 모달 컴포넌트 import

const HomeBigButton = () => {
  const [showTodayRecipe, setShowTodayRecipe] = useState(false); // ✅ 모달 상태 추가

  const cards = [
    {
      id: 1,
      backgroundImage: "/images/메인페이지1.jpg",
      title: "레시피",
      location: "수만가지 레시피를 확인해보세요.",
      action: () => console.log("레시피 클릭"),
    },
    {
      id: 2,
      backgroundImage: "/images/메인페이지2.jpg",
      title: "오늘 뭐 먹지?",
      location: "오늘 먹을 음식을 추천받아보세요.",
      action: () => setShowTodayRecipe(true), // ✅ 버튼 클릭 시 모달 열기
    },
    {
      id: 3,
      backgroundImage: "/images/메인페이지3.jpg",
      title: "AI 음식 추천",
      location: "내 맞춤 음식 추천을 받아보세요.",
      action: () => console.log("AI 추천 클릭"),
    },
    {
      id: 4,
      backgroundImage: "/images/메인페이지4.jpg",
      title: "SNS",
      location: "내가 만든 음식을 공유해봐요.",
      action: () => console.log("SNS 클릭"),
    },
  ];

  return (
    <div className="card-div">
      {showTodayRecipe && <TodayRecipe onClose={() => setShowTodayRecipe(false)} />} {/* ✅ 모달 표시 */}
      
      <div className="container px-4 py-5" id="custom-cards">
        <div className="custom-grid">
          {cards.map((card) => (
            <div
              className={`card card-${card.id}`}
              key={card.id}
              style={{
                backgroundImage: `url(${card.backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="content">
                <h3>{card.title}</h3>
                <p>{card.location}</p>
                <button onClick={card.action} className="rounded-button">
                  이동하기
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeBigButton;
