import React from "react";
import "../../styles/profile/ProfilePage.css";

const ProfileHeader = ({ profileImage, nickname, subscribers, posts, onOpenPreference }) => {
  return (
    <div className="profile-header">
      <img src={profileImage} alt="프로필" className="profile-avatar" />
      <h2 className="profile-username">
        {nickname}
        {/* <span className="edit-icon">✏️</span> */}
      </h2>
      <div className="profile-info">
        <span>구독자수: <strong>{subscribers}</strong></span> 
        <span>게시물: <strong>{posts}</strong></span>
      </div>

      {/* ProfilePage에서 관리하는 상태를 사용하도록 변경 */}
      <button className="profile-button" onClick={onOpenPreference}>선호/기피</button>
    </div>
  );
};

export default ProfileHeader;
