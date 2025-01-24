import React, { useState } from "react"
import ProfileHeader from "../../components/ProfilePage/ProfileHeader"
import ProfileTabs from "../../components/ProfilePage/ProfileTabs"
import RecipeList from "../../components/ProfilePage/RecipeList"
import BookmarkList from "../../components/ProfilePage/BookmarkList"
import FeedList from "../../components/ProfilePage/FeedList"
import "../../styles/profile/ProfilePage.css" // ✅ 스타일 파일 import

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("recipes")

  return (
    <div className="profile-container">
      {/* ✅ 프로필 헤더 */}
      <ProfileHeader />

      {/* ✅ 프로필 탭 */}
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* ✅ 탭에 따라 다른 컴포넌트 표시 */}
      <div className="tab-content">
        {activeTab === "recipes" && <RecipeList />}
        {activeTab === "bookmarks" && <BookmarkList />}
        {activeTab === "feed" && <FeedList />}
      </div>
    </div>
  )
}

export default ProfilePage
