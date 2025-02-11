import React, { useState, useEffect } from "react";
import BackgroundEffect from "./BackgroundEffect";
import "../../styles/profile/ProfileHeader.css";
import Swal from "sweetalert2";

const ProfileHeaderYou = ({ nickname }) => {
  const [season, setSeason] = useState("spring");
  const [background, setBackground] = useState("#FFEBE9");
  const [profileData, setProfileData] = useState({});
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0); // ✅ 구독자 수 상태 추가
  const [postCount, setPostCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // ✅ 프로필 데이터 가져오기
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`https://i12e107.p.ssafy.io/api/users/read/another-info/${nickname}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("프로필 데이터를 불러오는 데 실패했습니다.");
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error("❌ 프로필 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
    fetchSubscriptionStatus();
    fetchSubscriberCount();
    fetchPostCount();
  }, [nickname]);

  // ✅ 구독 상태 확인
  const fetchSubscriptionStatus = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const response = await fetch(`https://i12e107.p.ssafy.io/api/subscribe/read/check/${nickname}`, {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("구독 상태 확인 실패");
      const data = await response.json();
      setIsSubscribed(data.isSubscribed);
    } catch (error) {
      console.error("❌ 구독 상태 확인 실패:", error);
    }
  };
  
  // ✅ 구독 수 가져오기
  const fetchSubscriberCount = async () => {
    if (!user?.nickname) return; // 닉네임이 없으면 실행 안 함

    try {
      const response = await fetch(`https://i12e107.p.ssafy.io/api/subscribe/read/count/${nickname}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("구독자 수 조회 실패");
      }

      const data = await response.json();
      setSubscriberCount(data.count); // ✅ 구독자 수 저장
    } catch (error) {
      console.error("❌ 구독자 수 불러오기 실패:", error);
    }
  };

  // ✅ 게시물 개수 가져오기
  const fetchPostCount = async () => {
    try {
      const response = await fetch(`https://i12e107.p.ssafy.io/api/myOwnRecipe/read/diffUserRecipeList/${nickname}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("게시물 개수 조회 실패");
      const data = await response.json();
      setPostCount(data.length);
    } catch (error) {
      console.error("❌ 게시물 개수 불러오기 실패:", error);
    }
  };


// ✅ 구독하기 / 구독 취소
const handleSubscribeToggle = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    Swal.fire("로그인 필요", "구독하려면 로그인해주세요.", "warning");
    return;
  }

  const url = isSubscribed
    ? `https://i12e107.p.ssafy.io/api/subscription/delete/${nickname}`
    : `https://i12e107.p.ssafy.io/api/subscription/create/${nickname}`;
console.log(nickname)
  try {
    await fetch(url, {
      method: isSubscribed ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });

    setIsSubscribed(!isSubscribed);
    setSubscriberCount((prev) => (isSubscribed ? prev - 1 : prev + 1)); // ✅ 구독 수 업데이트
    Swal.fire("완료!", isSubscribed ? "구독 취소됨" : "구독 완료!", "success");
  } catch (error) {
    Swal.fire("오류", "구독 상태 변경 실패", "error");
  }
};

  if (loading) return <div className="profile-header">🔄 프로필 로딩 중...</div>;

  return (
    <div className="profile-header" style={{ background }}>
      {/* 배경 이펙트 추가 */}
      <BackgroundEffect season={season} setSeason={setSeason} setBackground={setBackground} />

      <div className="profile-content">
        {/* 프로필 이미지 */}
        <div className="profile-avatar-container">
          <img src={profileData.image || "/default_profile.png"} alt="프로필" className="profile-avatar" />
        </div>

        {/* 닉네임 */}
        <div className="profile-details">
          <div className="profile-username">{profileData.nickname}</div>
          {/* ✅ 구독 수 & 게시물 수 추가 */}
          <div className="profile-info">
            <span style={{ marginRight: "15px" }}>구독자 수: <strong>{subscriberCount}</strong></span>
            <span>게시물 수: <strong>{postCount}</strong></span>
          </div>

          {/* 구독 버튼 */}
          <button
            className={`subscriber-button ${isSubscribed ? "subscribed" : ""}`}
            onClick={handleSubscribeToggle}
          >
            {isSubscribed ? "구독 중" : "구독하기"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeaderYou;
