import React from "react";


const ProfileTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div style={styles.tabContainer}>
      <button 
        onClick={() => setActiveTab("recipes")} 
        style={activeTab === "recipes" ? styles.activeTab : styles.tab}>
        내 레시피
      </button>
      <button 
        onClick={() => setActiveTab("bookmarks")} 
        style={activeTab === "bookmarks" ? styles.activeTab : styles.tab}>
        북마크 레시피
      </button>
      <button 
        onClick={() => setActiveTab("feed")} 
        style={activeTab === "feed" ? styles.activeTab : styles.tab}>
        피드
      </button>
    </div>
  );
};

const styles = {
  tabContainer: {
    display: "flex",
    justifyContent: "space-around",
    padding: "10px 0",
    background: "#fff",
    borderBottom: "1px solid #ddd",
  },
  tab: {
    flex: 1,
    padding: "10px",
    border: "none",
    background: "none",
    fontSize: "16px",
    cursor: "pointer",
  },
  activeTab: {
    flex: 1,
    padding: "10px",
    border: "none",
    background: "#2ebf91",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default ProfileTabs;
