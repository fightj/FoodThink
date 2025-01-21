import React, { useState } from "react";
import ProfileHeader from "../components/ProfilePage/ProfileHeader";
import ProfileTabs from "../components/ProfilePage/ProfileTabs";
import RecipeList from "../components/ProfilePage/RecipeList";
import BookmarkList from "../components/ProfilePage/BookmarkList";
import FeedList from "../components/ProfilePage/FeedList";

const ProfilePage = () => {
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
