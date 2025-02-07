import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext"; // ✅ UserContext 가져오기
import ProfileHeader from "../../components/Profile/ProfileHeader";
import ProfileTabs from "../../components/Profile/ProfileTabs";
import RecipeList from "../../components/Profile/RecipeList";
import BookmarkList from "../../components/Profile/BookmarkList";
import FeedList from "../../components/Profile/FeedList";
import LoginCheck from "../../components/base/LoginCheck"; // ✅ 로그인 체크 추가
import "../../styles/profile/ProfilePage.css";

const ProfilePage = () => {
  const { id } = useParams(); // URL에서 userId 가져오기
  const { user } = useContext(UserContext); // ✅ UserContext에서 user 가져오기
  const [activeTab, setActiveTab] = useState("recipes");
  const [userId, setUserId] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ sessionStorage에서 user 정보 가져오기
    const sessionUser = JSON.parse(sessionStorage.getItem("user"));
    const sessionUserId = sessionUser ? sessionUser.userId : null;

    console.log("🌟 UserContext에서 가져온 user:", user);
    console.log("📌 sessionStorage에서 가져온 userId:", sessionUserId);
    console.log("🔗 URL에서 받은 userId:", id);

    // ✅ 최종적으로 사용할 userId 결정 (UserContext > sessionStorage > URL userId)
    const finalUserId = user?.userId || sessionUserId || id;
    console.log("✅ 최종 userId:", finalUserId);

    if (!finalUserId) {
      console.error("🚨 사용자 ID를 가져오지 못했습니다.");
      setLoading(false);
      return;
    }

    setUserId(finalUserId);
    setIsOwnProfile(String(finalUserId) === String(id)); // 문자열 비교로 안전성 확보
    setLoading(false);
  }, [user, id]);

  if (loading) {
    return <div className="loading-text">🔄 로그인 확인 중...</div>;
  }

  return (
    <div className="base-div">
      <LoginCheck />

      <div className="parent-container">
        <div className="card-div">
          <div className="profile-container">
            <ProfileHeader userId={userId} isOwnProfile={isOwnProfile} />

            <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} userId={userId} />

            <div className="tab-content">
              {activeTab === "recipes" && <RecipeList userId={userId} />}
              {activeTab === "bookmarks" && <BookmarkList userId={userId} />}
              {activeTab === "feed" && <FeedList userId={userId} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
