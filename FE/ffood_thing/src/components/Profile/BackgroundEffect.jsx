import React, { useState, useEffect } from "react";
import "../../styles/profile/ProfileHeader.css";

const BackgroundEffect = ({ season, setSeason, setBackground, updateUserSeason, isEditable = false }) => {
  const [fallingElements, setFallingElements] = useState([]);

  const seasonStyles = {
    봄: { background: "#FFEBE9", effectClass: "falling-cherry-blossom", emoji: "🌸" },
    여름: { background: "#B3E5FC", effectClass: "falling-rain", emoji: "💧" },
    가을: { background: "#FFD180", effectClass: "falling-leaves", emoji: "🍁" },
    겨울: { background: "#E3F2FD", effectClass: "falling-snow", emoji: "❄" }
  };

  // ✅ 계절 스타일 적용
  const applySeason = (selectedSeason) => {
    setSeason(selectedSeason);
    setBackground(seasonStyles[selectedSeason].background);
    generateFallingElements(selectedSeason);
  };

  // ✅ 떨어지는 효과 생성
  const generateFallingElements = (currentSeason) => {
    const elements = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      emoji: seasonStyles[currentSeason].emoji,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 3 + 3}s`
    }));
    setFallingElements(elements);
  };

  // ✅ 테마 변경 시 서버에도 저장
  const changeSeason = (newSeason) => {
    if (!seasonStyles[newSeason]) return;
    applySeason(newSeason);
    updateUserSeason(newSeason); // ✅ ProfileHeaderMe.jsx에서 전달받은 함수 호출
  };

  useEffect(() => {
    if (season) {
      applySeason(season); // 처음 렌더링 시 설정 적용
    }
  }, [season]);

  return (
    <div className="background-effect">
      {/* 🟡 떨어지는 계절 이펙트 */}
      <div className="falling-container">
        {fallingElements.map((element) => (
          <div
            key={element.id}
            className={`falling-effect ${seasonStyles[season]?.effectClass}`}
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
      {isEditable && (
      <div className="season-buttons">
        <button className="spring-btn" onClick={() => changeSeason("봄")}>🌸</button>
        <button className="summer-btn" onClick={() => changeSeason("여름")}>🌞</button>
        <button className="autumn-btn" onClick={() => changeSeason("가을")}>🍁</button>
        <button className="winter-btn" onClick={() => changeSeason("겨울")}>❄</button>
      </div>
      )}
    </div>
  );
};

export default BackgroundEffect;
