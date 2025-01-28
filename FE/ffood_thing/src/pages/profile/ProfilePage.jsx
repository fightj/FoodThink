import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import ProfileHeader from "../../components/Profile/ProfileHeader";
import ProfileTabs from "../../components/Profile/ProfileTabs";
import RecipeList from "../../components/Profile/RecipeList";
import BookmarkList from "../../components/Profile/BookmarkList";
import FeedList from "../../components/Profile/FeedList";
import profileData from "../../data/ProfileData"; // 더미 데이터 불러오기
import "../../styles/profile/ProfilePage.css";

const ProfilePage = () => {
  const { id } = useParams(); // URL에서 userId 가져오기
  const location = useLocation(); // 현재 URL을 가져오는 hook
  const user = profileData.find(user => user.id === id); // ID에 맞는 사용자 찾기
  const [activeTab, setActiveTab] = useState("recipes");
  const [showPreference, setShowPreference] = useState(false); // 음식선호도 모달 상태 추가

  // 음식 선호도 상태를 ProfilePage에서 관리 (더미 데이터에서 불러옴)
  const [preferences, setPreferences] = useState(user ? user.preferences : []);

  // 음식 선호도 변경 함수 (더미 데이터 수정 효과, 근데 새로고침하면 초기화됨)
  const handlePreferenceChange = (newPreferences) => {
    setPreferences(newPreferences); // UI 업데이트
    user.preferences = newPreferences; // 더미 데이터 변경 (실제 저장은 안 됨;;)
  };

  // 존재하지 않는 ID일 경우 예외 처리
  if (!user) {
    return <div className="profile-container">해당 사용자를 찾을 수 없습니다.</div>;
  }

  // URL의 쿼리 파라미터로 activeTab을 설정
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tab = queryParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  return (
    <div className="profile-container">
      <ProfileHeader 
        id={user.id} 
        nickname={user.nickname} 
        profileImage={user.profileImage}
        subscribers={user.subscribers} 
        posts={user.posts}
        preferences={preferences} 
        onOpenPreference={() => setShowPreference(true)} // 음식선호도 버튼 클릭 이벤트 전달
      />
      
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="tab-content">
        {activeTab === "recipes" && <RecipeList recipes={user.recipes} />}
        {activeTab === "bookmarks" && <BookmarkList bookmarks={user.bookmarks} />}
        {activeTab === "feed" && <FeedList feeds={user.feeds} />}
      </div>

      {/* 음식선호도 설정 모달 + 배경 블러 처리 */}
      {showPreference && (
        <>
          <div className="modal-backdrop" onClick={() => setShowPreference(false)}></div>
          <Preference 
            preferences={preferences} 
            onClose={() => setShowPreference(false)}
            onSave={handlePreferenceChange}
          />
        </>
      )}
    </div>
  );
};

export default ProfilePage;
