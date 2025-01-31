import React, { useState } from "react";
import "../../styles/home/HomeBigButton.css";
import { Link } from "react-router-dom";
import TodayRecommendModal from "./TodayRecommendModal"; // 모달 컴포넌트 import

const HomeBigButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리

  const cards = [
    {
      id: 1,
      backgroundImage: "/images/메인페이지1.jpg",
      title: "레시피",
      location: "수만가지 레시피를 확인해보세요.",
      link: "/recipes",
    },
    {
      id: 2,
      backgroundImage: "/images/메인페이지2.jpg",
      title: "오늘 뭐 먹지?",
      location: "오늘 먹을 음식을 추천받아보세요.",
      link: "", // 페이지 이동 X
    },
    {
      id: 3,
      backgroundImage: "/images/메인페이지3.jpg",
      title: "AI 음식 추천",
      location: "내 맞춤 음식 추천을 받아보세요.",
      link: "/ai-recommend",
    },
    {
      id: 4,
      backgroundImage: "/images/메인페이지4.jpg",
      title: "SNS",
      location: "내가 만든 음식을 공유해봐요.",
      link: "/sns",
    },
  ];

  return (
    <div className="card-div">
      <div className="container px-4 py-5" id="custom-cards">
        <div className="custom-grid">
          {cards.map((card) => (
            <div className={`card card-${card.id}`} key={card.id}>
              <div className="content">
                <h3>{card.title}</h3>
                <p>{card.location}</p>
                {card.id === 2 ? (
                  // "오늘 뭐 먹지?" 버튼 클릭 시 모달 열기
                  <button
                    className="rounded-button"
                    onClick={() => setIsModalOpen(true)}
                  >
                    추천받기
                  </button>
                ) : (
                  // 나머지는 Link로 이동
                  <Link to={card.link}>
                    <button className="rounded-button">이동하기</button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 모달 컴포넌트 */}
      <TodayRecommendModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default HomeBigButton;
