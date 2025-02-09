import React from "react";
import "../../styles/profile/ProfileTabs.css";

const ProfileTabs = ({ activeTab, setActiveTab, isOwnProfile }) => {
  return (
    <div className="tab-container">
      {/* ✅ 타인의 프로필일 경우 레시피 탭만 표시되며 너비를 100%로 설정 */}
      <button 
        onClick={() => setActiveTab("recipes")} 
        className={`tab ${activeTab === "recipes" ? "active-tab" : ""} ${!isOwnProfile ? "single-tab" : ""}`}>
        레시피
      </button>

      {/* ✅ 본인 프로필일 때만 북마크 & 피드 탭 표시 */}
      {isOwnProfile && (
        <>
          <button 
            onClick={() => setActiveTab("bookmarks")} 
            className={activeTab === "bookmarks" ? "active-tab" : "tab"}>
            북마크
          </button>
          <button 
            onClick={() => setActiveTab("feed")} 
            className={activeTab === "feed" ? "active-tab" : "tab"}>
            피드
          </button>
        </>
      )}
    </div>
  );
};

export default ProfileTabs;
