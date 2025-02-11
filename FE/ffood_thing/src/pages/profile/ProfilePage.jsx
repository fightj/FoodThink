import React, { useState, useEffect, useContext } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import ProfileHeaderMe from "../../components/Profile/ProfileHeaderMe";
import ProfileHeaderYou from "../../components/Profile/ProfileHeaderYou";
import ProfileTabs from "../../components/Profile/ProfileTabs";
import RecipeList from "../../components/Profile/RecipeList";
import BookmarkList from "../../components/Profile/BookmarkList";
import FeedList from "../../components/Profile/FeedList";
import LoginCheck from "../../components/base/LoginCheck";
import "../../styles/profile/ProfilePage.css";

const ProfilePage = () => {
  const { nickname } = useParams(); // ✅ URL에서 닉네임 가져오기
  const { user } = useContext(UserContext); // ✅ 현재 로그인한 유저 정보 가져오기
  const location = useLocation();
  const navigate = useNavigate();

// ✅ URL에서 tab 값을 읽어 초기 상태 설정
const getTabFromURL = () => {
  const params = new URLSearchParams(location.search);
  return params.get("tab") || "recipes"; // 기본값: recipes
};

  const [activeTab, setActiveTab] = useState("getTabFromURL()");
  const isOwnProfile = user?.nickname === nickname; // ✅ 본인 프로필 여부 판별
  const [profileData, setProfileData] = useState(isOwnProfile ? user : null);
  const [loading, setLoading] = useState(!isOwnProfile); // 본인 프로필이면 API 호출 불필요

  useEffect(() => {
    // ✅ URL이 변경될 때마다 activeTab 업데이트
    setActiveTab(getTabFromURL());
  }, [location.search]);

  useEffect(() => {
    if (isOwnProfile) {
      setProfileData(user);
      return;
    }

    // ✅ 타인의 프로필을 조회할 경우 API 호출
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`https://i12e107.p.ssafy.io/api/users/read/another-info/${nickname}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("유저 정보 조회 실패");

        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error("❌ 유저 정보 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [nickname, isOwnProfile, user]);

// ✅ 탭 변경 시 URL을 업데이트하여 새로고침해도 유지됨
const handleTabChange = (newTab) => {
  navigate(`/profile/${nickname}?tab=${newTab}`);
};


  if (loading) {
    return <div className="loading-text">🔄 프로필 불러오는 중...</div>;
  }

  if (!profileData) {
    return <div className="error-text">😢 해당 유저를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="base-div">
      <LoginCheck />
      <div className="parent-container">
        <div className="card-div">
          <div className="profile-container">
            {/* ✅ 본인 프로필이면 ProfileHeaderMe, 타인 프로필이면 ProfileHeaderYou */}
            {isOwnProfile ? <ProfileHeaderMe /> : <ProfileHeaderYou nickname={nickname} />}

            <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} isOwnProfile={isOwnProfile} />
            <div className="tab-content">
              {activeTab === "recipes" && <RecipeList nickname={nickname} />}
              {activeTab === "bookmarks" && <BookmarkList nickname={nickname} />}
              {activeTab === "feed" && <FeedList nickname={nickname} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
