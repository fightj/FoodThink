import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProfileHeader from "../../components/Profile/ProfileHeader";
import ProfileTabs from "../../components/Profile/ProfileTabs";
import RecipeList from "../../components/Profile/RecipeList";
import BookmarkList from "../../components/Profile/BookmarkList";
import FeedList from "../../components/Profile/FeedList";
import LoginCheck from "../../components/base/LoginCheck"; // ✅ LoginCheck 컴포넌트 추가
import Swal from "sweetalert2";
import "../../styles/profile/ProfilePage.css";

const ProfilePage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("recipes");
  const [userId, setUserId] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
    setIsOwnProfile(id === storedUserId);
    setLoading(false);
  }, [id]);

  // ✅ 회원 탈퇴 함수
  const handleDeleteAccount = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      Swal.fire("로그인이 필요합니다.", "", "error");
      return;
    }

    Swal.fire({
      title: "정말 탈퇴하시겠습니까? 😢",
      text: "탈퇴 후에는 복구가 불가능합니다.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "탈퇴하기",
      cancelButtonText: "취소",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch("https://i12e107.p.ssafy.io/api/users/delete", {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!response.ok) {
            throw new Error(`회원 탈퇴 실패: ${response.status}`);
          }

          Swal.fire({
            title: "회원 탈퇴 완료",
            text: "그동안 이용해주셔서 감사합니다.",
            icon: "success",
          }).then(() => {
            localStorage.clear();
            navigate("/login");
          });
        } catch (error) {
          console.error("❌ 회원 탈퇴 오류:", error);
          Swal.fire("회원 탈퇴 중 오류가 발생했습니다.", "", "error");
        }
      }
    });
  };

  if (loading) {
    return <div className="loading-text">🔄 로그인 확인 중...</div>;
  }

  return (
    <div className="base-div">
      <LoginCheck />

      <div className="parent-container">
        <div className="card-div">
          <div className="profile-container">
            <ProfileHeader userId={id} isOwnProfile={isOwnProfile} />

            {isOwnProfile && (
              <div className="profile-actions">
                <button className="btn btn-danger" onClick={handleDeleteAccount}>
                  회원 탈퇴
                </button>
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
