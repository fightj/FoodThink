import React, { useState, useEffect, useContext } from "react";
import BackgroundEffect from "./BackgroundEffect";
import { UserContext } from "../../contexts/UserContext";
import "../../styles/profile/ProfileHeader.css";
import Swal from "sweetalert2";

const ProfileHeaderYou = ({ nickname }) => {
  const { user } = useContext(UserContext);
  const [season, setSeason] = useState("spring");
  const [background, setBackground] = useState("#FFEBE9");
  const [profileData, setProfileData] = useState({});
  const [isSubscribed, setIsSubscribed] = useState(null); //구독상태
  const [subscriberCount, setSubscriberCount] = useState(0); // 구독자 수 상태 추가
  const [postCount, setPostCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mySubscriptionCount, setMySubscriptionCount] = useState(0); // ✅ 내가 구독한 수 상태 추가


  // ✅ 프로필 데이터 가져오기
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
      console.log("✅ 서버에서 받은 구독 상태:", data); // 서버 응답 확인용 로그

      // 서버에서 받은 데이터가 유효하면 즉시 적용
      if (data?.check !== undefined) {
        setIsSubscribed(data.check); // 🔥 여기서 check 값을 정확하게 설정
      } else {
        console.warn("⚠ 서버 응답에 check 필드가 없음, 기본값 false 적용");
        setIsSubscribed(false);
      }
    } catch (error) {
      console.error("❌ 구독 상태 확인 실패:", error);
      setIsSubscribed(false); // 네트워크 오류 시 기본값 false
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

  // ✅ 내가 구독한 수 가져오기 (내 마이페이지에 반영)
  const fetchMySubscriptionCount = async () => {
    if (!user?.nickname) return; // ✅ 내 닉네임 없으면 실행 안 함

    try {
      const response = await fetch(`https://i12e107.p.ssafy.io/api/subscribe/read/count/${user.nickname}`, {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });

      if (!response.ok) {
        throw new Error("내 구독한 수 조회 실패");
      }

      const data = await response.json();
      setMySubscriptionCount(data.count); // ✅ "내가 구독한 수" 업데이트
    } catch (error) {
      console.error("❌ 내 구독 수 불러오기 실패:", error);
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

    const isUnsubscribing = isSubscribed; // 현재 상태 저장
    const url = isSubscribed
      ? `https://i12e107.p.ssafy.io/api/subscribe/delete/${nickname}`
      : `https://i12e107.p.ssafy.io/api/subscribe/create/${nickname}`;

    try {
      // console.log("🛠️ 구독 요청 URL:", url);
      // console.log("🛠️ 요청 방식:", isSubscribed ? "DELETE (구독 취소)" : "POST (구독하기)");

      // ✅ UI 즉시 반영 (서버 응답 기다리지 않고)
      setIsSubscribed(!isSubscribed);

      const response = await fetch(url, {
        method: isSubscribed ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });

      // const data = await response.json();
      let data;
    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json(); // JSON 응답 처리
    } else {
      data = await response.text(); // 일반 텍스트 응답 처리
    }

    if (!response.ok) {
      console.error("❌ 서버 응답 오류:", data);
      throw new Error(typeof data === "string" ? data : data.message || "구독 상태 변경 실패");
    }

      console.log("✅ 서버 응답 성공:", data);

      // ✅ 최신 구독 상태 다시 가져오기 (서버와 동기화)
      await fetchSubscriptionStatus();
      await fetchSubscriberCount(); // 상대방의 구독자 수 업데이트
      await fetchMySubscriptionCount();

      Swal.fire("완료!", isUnsubscribing ? "구독 취소됨!" : "구독 완료!", "success");
    } catch (error) {
      console.error("❌ 구독 상태 변경 실패:", error);
      Swal.fire("오류", error.message, "error");

      // ❌ 서버 요청 실패 시 UI 롤백 (이전 상태로 복원)
      setIsSubscribed(isUnsubscribing);
    }
  };


  // ✅ 해당 유저 페이지에 들어올 때 최신 구독 상태 불러오기
  useEffect(() => {
    setLoading(true); // ✅ 로딩 상태 설정
    Promise.all([
      fetchProfileData(),
      fetchPostCount(),
      fetchSubscriberCount(), // 타인의 구독자 수 업데이트
      fetchSubscriptionStatus(), // ✅ 구독 상태 확인 (해당 유저를 내가 구독했는지)
      fetchMySubscriptionCount(), // ✅ 내 마이페이지에서 구독 수 가져오기
    ]).then(() => setLoading(false)); // ✅ 모든 데이터 가져온 후 로딩 상태 해제
  }, [nickname, isSubscribed]); // ✅ 닉네임이 변경될 때 실행


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
            className={`subscriber-button ${isSubscribed === true ? "subscribed" : ""}`}
            onClick={handleSubscribeToggle}
            disabled={isSubscribed === null} // 구독 상태를 아직 못 가져오면 버튼 비활성화
          >
            {isSubscribed === null ? "로딩 중..." : isSubscribed ? "구독 중" : "구독하기"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeaderYou;
