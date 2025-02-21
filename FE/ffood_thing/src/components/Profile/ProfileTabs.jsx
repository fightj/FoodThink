import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext"; // ✅ UserContext 가져오기
import "../../styles/profile/ProfileTabs.css";

const ProfileTabs = ({ activeTab, setActiveTab }) => {
  const { user } = useContext(UserContext); // ✅ 현재 로그인한 유저 정보 가져오기
  const { nickname } = useParams(); // ✅ URL에서 닉네임 가져오기
  const isOwnProfile = user?.nickname === nickname; // ✅ 본인 프로필 여부 판단

  return (
    <div className="tab-container">
      {/* ✅ 타인의 프로필일 경우 레시피 탭만 표시되며 너비를 100%로 설정 */}
      <button
        onClick={() => setActiveTab("recipes")}
        className={`tab ${activeTab === "recipes" ? "active-tab" : ""} ${!isOwnProfile ? "single-tab" : ""}`}
      >
        레시피
      </button>

      {/* ✅ 본인 프로필일 때만 북마크 & 피드 탭 표시 */}
      {isOwnProfile && (
        <>
          <button
            onClick={() => setActiveTab("bookmarks")}
            className={activeTab === "bookmarks" ? "active-tab" : "tab"}
          >
            북마크
          </button>
          <button
            onClick={() => setActiveTab("feed")}
            className={activeTab === "feed" ? "active-tab" : "tab"}
          >
            피드
          </button>
        </>
      )}
    </div>
  );
};

export default ProfileTabs;
