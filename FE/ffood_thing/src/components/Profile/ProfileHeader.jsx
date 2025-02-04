import React from "react";
import "../../styles/profile/ProfileHeader.css";

const ProfileHeader = ({ profileImage, nickname, subscribers, posts, onOpenPreference }) => {
  return (
    <div className="profile-header">
        {/* 프로필 이미지 */}
        <img src={profileImage} alt="프로필" className="profile-avatar" />

        {/* 프로필 정보 (닉네임, 구독자, 게시물) */}
        <div className="profile-details">
          <div className="profile-username">{nickname}</div>
          <div className="profile-info">
            <span>구독자수: <strong>{subscribers}</strong></span>
            <span>게시물: <strong>{posts}</strong></span>
          </div>
          <button className="preference-button" onClick={onOpenPreference}>선호/기피</button>        
      </div>
    </div>
  );
};

export default ProfileHeader;
