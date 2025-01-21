import React, { useState } from "react";
import ProfileHeader from "../components/ProfilePage/ProfileHeader";
import ProfileTabs from "../components/ProfilePage/ProfileTabs";
import RecipeList from "../components/ProfilePage/RecipeList";
import BookmarkList from "../components/ProfilePage/BookmarkList";
import FeedList from "../components/ProfilePage/FeedList";

const ProfilePage = () => {
  console.log("✅ ProfilePage 렌더링됨!"); // ✅ 렌더링 확인용 콘솔 추가
  const [activeTab, setActiveTab] = useState("recipes");

  return (
    <div>
      <ProfileHeader />
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "recipes" && <RecipeList />}
      {activeTab === "bookmarks" && <BookmarkList />}
      {activeTab === "feed" && <FeedList />}
    </div>
  );
};

export default ProfilePage;
