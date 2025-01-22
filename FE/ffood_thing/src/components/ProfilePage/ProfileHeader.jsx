import React from "react";
import "../../styles/ProfilePage.css"; // ✅ 스타일 import

const ProfileHeader = () => {
  const profileImage = "/images/profile.jpg"; // ✅ Vite 방식 적용

  return (
    <div className="profile-header">
      <img src={profileImage} alt="프로필" className="profile-avatar" />
      <h2 className="profile-username">
        럭키가이 광전사 <span className="edit-icon">✏️</span>
      </h2>
      <div className="profile-info">
        <span>구독자수: <strong>20</strong></span>
        <span>게시물: <strong>15</strong></span>
      </div>
      <button className="profile-button">취향</button>
    </div>
  );
};

export default ProfileHeader;
