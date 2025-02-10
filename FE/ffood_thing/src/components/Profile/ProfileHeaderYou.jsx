import React, { useState, useEffect } from "react";
import BackgroundEffect from "./BackgroundEffect";
import "../../styles/profile/ProfileHeader.css";
import Swal from "sweetalert2";

const ProfileHeaderYou = ({ nickname }) => {
  const [season, setSeason] = useState("spring");
  const [background, setBackground] = useState("#FFEBE9");
  const [profileData, setProfileData] = useState({});
  const [isSubscribed, setIsSubscribed] = useState(false);
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
  }, [nickname]);

  // ✅ 구독하기 / 구독 취소
  const handleSubscribeToggle = async () => {
    const token = localStorage.getItem("accessToken");
    const url = isSubscribed
      ? `https://i12e107.p.ssafy.io/api/subscription/cancel/${nickname}`
      : `https://i12e107.p.ssafy.io/api/subscription/add/${nickname}`;

    try {
      await fetch(url, {
        method: isSubscribed ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });

      setIsSubscribed(!isSubscribed);
      Swal.fire("완료!", isSubscribed ? "구독 취소됨" : "구독 완료!", "success");
    } catch (error) {
      Swal.fire("오류", "구독 상태 변경 실패", "error");
    }
  };

  if (loading) return <div className="profile-header">🔄 프로필 로딩 중...</div>;

  return (
    <div className="profile-header" style={{ background }}> {/* ✅ 배경색 적용 */}
      {/* 배경 이펙트 추가 */}
      <BackgroundEffect season={season} setSeason={setSeason} setBackground={setBackground} />

      <div className="profile-content">
        <img src={profileData.image || "/default_profile.png"} alt="프로필" className="profile-avatar" />
        <div className="profile-username">{profileData.nickname}</div>
        <button onClick={handleSubscribeToggle}>{isSubscribed ? "구독 중" : "구독하기"}</button>
      </div>
    </div>
  );
};

export default ProfileHeaderYou;
