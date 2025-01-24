import React, { useState } from "react";
import { useParams } from "react-router-dom"; // URL에서 ID 가져오기
import ProfileHeader from "../../components/ProfilePage/ProfileHeader";
import ProfileTabs from "../../components/ProfilePage/ProfileTabs";
import RecipeList from "../../components/ProfilePage/RecipeList";
import BookmarkList from "../../components/ProfilePage/BookmarkList";
import FeedList from "../../components/ProfilePage/FeedList";
import profileData from "../../data/ProfileData"; // 더미 데이터 불러오기
import "../../styles/profile/ProfilePage.css";

const ProfilePage = () => {
  const { id } = useParams(); // URL에서 userId 가져오기
  const user = profileData.find(user => user.id === id); // ID에 맞는 사용자 찾기
  const [activeTab, setActiveTab] = useState("recipes");

  // ✅ 존재하지 않는 ID일 경우 예외 처리
  if (!user) {
    return <div className="profile-container">해당 사용자를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="profile-container">
      <ProfileHeader 
        id={user.id} 
        nickname={user.nickname} 
        profileImage={user.profileImage}
        subscribers={user.subscribers} 
        posts={user.posts}
        preferences={user.preferences} 
      />
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="tab-content">
        {activeTab === "recipes" && <RecipeList recipes={user.recipes} />}
        {activeTab === "bookmarks" && <BookmarkList bookmarks={user.bookmarks} />}
        {activeTab === "feed" && <FeedList feeds={user.feeds} />}
      </div>
    </div>
  );
};

export default ProfilePage;
