import React, { useState, useEffect } from "react";
import "../../styles/profile/ProfileHeader.css";

const ProfileHeader = ({ profileImage, nickname, subscribers, posts, onOpenPreference }) => {
  const [season, setSeason] = useState("spring"); // 기본 테마: 봄
  const [fallingElements, setFallingElements] = useState([]); // 떨어지는 요소 리스트

  // 계절별 배경색 & 애니메이션 클래스
  const seasonStyles = {
    spring: { background: "#FFEBE9", effectClass: "falling-cherry-blossom", emoji: "🌸" },
    summer: { background: "#B3E5FC", effectClass: "falling-rain", emoji: "💧" },
    autumn: { background: "#FFD180", effectClass: "falling-leaves", emoji: "🍂" },
    winter: { background: "#E3F2FD", effectClass: "falling-snow", emoji: "❄" }
  };

  // 계절 변경 함수
  const changeSeason = (newSeason) => {
    setSeason(newSeason);
    generateFallingElements(newSeason);
  };

  // 랜덤한 떨어지는 요소 생성
  const generateFallingElements = (currentSeason) => {
    const elements = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      emoji: seasonStyles[currentSeason].emoji,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 3 + 3}s` // 3~6초 사이의 랜덤 지속시간
    }));
    setFallingElements(elements);
  };

  // 초기 로딩 시 떨어지는 요소 생성
  useEffect(() => {
    generateFallingElements(season);
  }, []);

  return (
    <div className="profile-header" style={{ background: seasonStyles[season].background }}>
      {/* 🟡 떨어지는 계절 이펙트 */}
      <div className="falling-container">
        {fallingElements.map((element) => (
          <div
            key={element.id}
            className={`falling-effect ${seasonStyles[season].effectClass}`}
            style={{
              left: element.left,
              animationDuration: element.animationDuration
            }}
          >
            {element.emoji}
          </div>
        ))}
      </div>

      {/* 🟡 계절 변경 버튼 */}
      <div className="season-buttons">
        <button className="spring-btn" onClick={() => changeSeason("spring")}>🌸</button>
        <button className="summer-btn" onClick={() => changeSeason("summer")}>🌞</button>
        <button className="autumn-btn" onClick={() => changeSeason("autumn")}>🍂</button>
        <button className="winter-btn" onClick={() => changeSeason("winter")}>❄</button>
      </div>

      {/* 🟡 프로필 정보 */}
      <div className="profile-content">
        <img src={profileImage} alt="프로필" className="profile-avatar" />
        <div className="profile-details">
          <div className="profile-username">{nickname}</div>
          <div className="profile-info">
            <span>구독자수: <strong>{subscribers}</strong></span>
            <span>게시물: <strong>{posts}</strong></span>
          </div>
          <button className="preference-button" onClick={onOpenPreference}>선호/기피</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
