import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProfileHeader from "../../components/Profile/ProfileHeader";
import ProfileTabs from "../../components/Profile/ProfileTabs";
import RecipeList from "../../components/Profile/RecipeList";
import BookmarkList from "../../components/Profile/BookmarkList";
import FeedList from "../../components/Profile/FeedList";
import "../../styles/profile/ProfilePage.css";

const ProfilePage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("recipes");
  const [userId, setUserId] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ 로그인 여부 확인 및 userId 복구
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    let storedUserId = localStorage.getItem("userId");

    console.log("🔑 현재 로그인된 userId:", storedUserId);
    console.log("🔑 저장된 accessToken:", token);

    // ✅ Access Token 없으면 로그인 페이지로 강제 이동
    if (!token) {
      console.error("🚨 Access Token 없음 → 로그인 필요");
      alert("로그인이 필요합니다.");
      localStorage.clear(); // 🛑 불필요한 값 제거
      navigate("/login");
      return;
    }

    // ✅ userId가 없는 경우, JWT 토큰에서 복구 시도
    if (!storedUserId) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1])); // JWT 디코딩
        console.log("📌 디코딩된 JWT:", decodedToken);

        if (decodedToken.userId) {
          storedUserId = decodedToken.userId;
          localStorage.setItem("userId", storedUserId);
        } else if (decodedToken.sub) {
          storedUserId = decodedToken.sub;
          localStorage.setItem("userId", storedUserId);
        } else {
          throw new Error("❌ JWT에서 userId를 찾을 수 없음");
        }

        console.log("✅ 복구된 userId:", storedUserId);
      } catch (error) {
        console.error("❌ JWT 디코딩 실패:", error);
        localStorage.clear(); // 🛑 불필요한 값 제거 후 로그인 페이지로 이동
        navigate("/login");
        return;
      }
    }

    if (!storedUserId) {
      console.error("🚨 userId 없음 → 로그인 필요");
      alert("로그인이 필요합니다.");
      localStorage.clear();
      navigate("/login");
      return;
    }

    setUserId(storedUserId);
    setIsOwnProfile(id === storedUserId);
    setLoading(false);
  }, [id, navigate]);

  if (loading) {
    return <div className="loading-text">🔄 로그인 확인 중...</div>;
  }

  return (
    <div className="base-div">
      <div className="parent-container">
        <div className="card-div">
          <div className="profile-container">
            <ProfileHeader userId={id} isOwnProfile={isOwnProfile} />

            {isOwnProfile && (
              <div className="profile-actions"> 
                {/* <button className="btn btn-edit">프로필 수정</button>
                <button className="btn btn-danger">계정 삭제</button> */}
              </div>
            )}

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
