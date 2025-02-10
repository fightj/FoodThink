import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import ProfileHeader from "../../components/Profile/ProfileHeader";
import ProfileTabs from "../../components/Profile/ProfileTabs";
import RecipeList from "../../components/Profile/RecipeList";
import BookmarkList from "../../components/Profile/BookmarkList";
import FeedList from "../../components/Profile/FeedList";
import LoginCheck from "../../components/base/LoginCheck";
import "../../styles/profile/ProfilePage.css";

const ProfilePage = () => {
  const { id } = useParams(); // ✅ URL에서 userId 가져오기
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("recipes");
  const [profileData, setProfileData] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ 특정 유저의 프로필 데이터 가져오기
  const fetchProfileData = async (userId) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("🚨 Access Token 없음");
        setLoading(false);
        return;
      }

      const url = String(user?.userId) === String(userId)
        ? "https://i12e107.p.ssafy.io/api/users/read" // ✅ 본인 정보
        : `https://i12e107.p.ssafy.io/api/users/profile/${userId}`; // ✅ 타인 정보

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`프로필 데이터를 불러올 수 없습니다. 상태 코드: ${response.status}`);

      const data = await response.json();
      setProfileData(data);
      setIsOwnProfile(String(user?.userId) === String(userId));
    } catch (error) {
      console.error("❌ 프로필 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProfileData(id); // ✅ URL에서 받은 userId로 프로필 불러오기
    } else {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return <div className="loading-text">🔄 프로필 로딩 중...</div>;
  }

  return (
    <div className="base-div">
      <LoginCheck />

      <div className="parent-container">
        <div className="card-div">
          <div className="profile-container">
            <ProfileHeader userId={id} isOwnProfile={isOwnProfile} profileData={profileData} /> {/* ✅ profileData 전달 */}

            <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} userId={id} />

            <div className="tab-content">
              {activeTab === "recipes" && <RecipeList userId={id} />}
              {activeTab === "bookmarks" && <BookmarkList userId={id} />}
              {activeTab === "feed" && <FeedList userId={id} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
