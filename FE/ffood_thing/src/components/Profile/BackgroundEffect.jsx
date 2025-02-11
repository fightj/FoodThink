import React, { useState, useEffect } from "react";
import "../../styles/profile/ProfileHeader.css";

const BackgroundEffect = ({ season, setSeason, setBackground }) => {
  const [fallingElements, setFallingElements] = useState([]);

  const seasonStyles = {
    spring: { background: "#FFEBE9", effectClass: "falling-cherry-blossom", emoji: "🌸" },
    summer: { background: "#B3E5FC", effectClass: "falling-rain", emoji: "💧" },
    autumn: { background: "#FFD180", effectClass: "falling-leaves", emoji: "🍂" },
    winter: { background: "#E3F2FD", effectClass: "falling-snow", emoji: "❄" }
  };

  // 떨어지는 요소 생성
  const generateFallingElements = (currentSeason) => {
    const elements = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      emoji: seasonStyles[currentSeason].emoji,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 3 + 3}s`
    }));
    setFallingElements(elements);
  };

  // 계절 변경 함수
  const changeSeason = (newSeason) => {
    setSeason(newSeason);
    setBackground(seasonStyles[newSeason].background);
    generateFallingElements(newSeason);
  };

  // useEffect (배경 애니메이션 분리)
  useEffect(() => {
    generateFallingElements(season);
    setBackground(seasonStyles[season].background); // ✅ 배경 색상 변경
  }, [season]);

  return (
    <div className="background-effect">
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
    </div>
  );
};

export default BackgroundEffect;
