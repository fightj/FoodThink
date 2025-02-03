import React from "react";
import "../../styles/profile/ProfileTabs.css";

const ProfileTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="tab-container">
      <button 
        onClick={() => setActiveTab("recipes")} 
        className={activeTab === "recipes" ? "active-tab" : "tab"}>
        레시피
      </button>
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
    </div>
  );
};

export default ProfileTabs;
