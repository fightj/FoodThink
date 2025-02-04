import React, { useEffect, useState, useRef } from "react";
import "../../styles/profile/ProfileHeader.css";

const ProfileHeader = ({ profileImage, nickname, subscribers, posts, onOpenPreference }) => {
  const [puddings, setPuddings] = useState([]);
  const puddingImages = ["/images/bg1.png", "/images/bg2.png", "/images/bg3.png"];
  const addedPuddings = useRef(false);

  useEffect(() => {
    console.log(`🐤 useEffect 실행됨! (게시글 수: ${posts} )`);

    if (posts === 0 || addedPuddings.current) return;
    addedPuddings.current = true;

    const numPuddings = posts;
    const newPuddings = [];

    for (let i = 0; i < numPuddings; i++) {
      setTimeout(() => {
        const newPudding = {
          src: puddingImages[i % puddingImages.length],
          left: `${Math.random() * 80 + 10}%`,
          delay: i * 500,
        };

        console.log(`🍮 추가된 푸딩:`, newPudding);

        setPuddings((prev) => [...prev, newPudding]);
      }, i * 500);
    }
  }, [posts]);

  return (
    <div className="profile-header">
      {/* 🟡 푸딩이 떨어지는 컨테이너 */}
      <div className="falling-container">
        {puddings.map((pudding, index) => (
          <img
            key={index}
            src={pudding.src}
            alt="푸딩"
            className="falling-item"
            style={{
              left: pudding.left,
              animationDelay: `${pudding.delay}ms`
            }} 
          />
        ))}
      </div>

      {/* 🎯 프로필 정보 (정중앙에 배치) */}
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
