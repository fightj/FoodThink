import React, { useState, useEffect } from "react";
import "../../styles/profile/ProfileHeader.css";

const ProfileHeader = ({ userId, isOwnProfile, onOpenPreference }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newNickname, setNewNickname] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isImageEditing, setIsImageEditing] = useState(false); // 이미지 수정 모달
  const [selectedImage, setSelectedImage] = useState(null); // 선택한 이미지
  const [season, setSeason] = useState("spring"); // 기본 테마: 봄
  const [fallingElements, setFallingElements] = useState([]); // 떨어지는 요소 리스트

  // 계절별 배경색 & 애니메이션 클래스
  const seasonStyles = {
    spring: { background: "#FFEBE9", effectClass: "falling-cherry-blossom", emoji: "🌸" },
    summer: { background: "#B3E5FC", effectClass: "falling-rain", emoji: "💧" },
    autumn: { background: "#FFD180", effectClass: "falling-leaves", emoji: "🍂" },
    winter: { background: "#E3F2FD", effectClass: "falling-snow", emoji: "❄" }
  };

// ✅ 프로필 데이터 불러오기
useEffect(() => {
  const fetchProfileData = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("🚨 Access Token 없음");
      return;
    }

    try {
      const response = await fetch(`https://i12e107.p.ssafy.io/api/users/read`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`프로필 데이터를 불러오는 데 실패했습니다. 상태 코드: ${response.status}`);
      }
      const data = await response.json();
      console.log("📌 불러온 프로필 데이터:", data);
      setProfileData(data);
    } catch (error) {
      console.error("❌ 프로필 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchProfileData();
}, []);

const handleNicknameChange = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    setErrorMessage("로그인이 필요합니다.");
    return;
  }
  try {
    const response = await fetch("https://i12e107.p.ssafy.io/api/users/update/nickname", {
      method: "PUT",
      // headers: {
      //   "Content-Type": "application/json",
      //   Authorization: `Bearer ${token}`,
      // },
      body: JSON.stringify({ nickname: newNickname }),
    });
    const data = await response.json();
    if (response.ok) {
      setProfileData((prev) => ({ ...prev, nickname: data.nickname }));
      setIsEditing(false);
      setErrorMessage("");
    } else {
      setErrorMessage(data.message || "닉네임 변경에 실패했습니다.");
    }
  } catch (error) {
    setErrorMessage("서버 오류가 발생했습니다.");
  }
};

// ✅ 프로필 이미지 변경 핸들러
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    setSelectedImage(file);
  }
};

// ✅ 프로필 이미지 업로드 요청
const uploadProfileImage = async () => {
  if (!selectedImage) return;

  const token = localStorage.getItem("accessToken");
  if (!token) {
    setErrorMessage("로그인이 필요합니다.");
    return;
  }

  const formData = new FormData();
  formData.append("image", selectedImage);

  try {
    const response = await fetch("https://i12e107.p.ssafy.io/api/users/update/image", {
      method: "PIT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (response.ok) {
      setProfileData((prev) => ({ ...prev, profileImage: data.image }));
      setIsImageEditing(false);
      setSelectedImage(null);
    } else {
      setErrorMessage(data.message || "프로필 이미지 변경에 실패했습니다.");
    }
  } catch (error) {
    setErrorMessage("서버 오류가 발생했습니다.");
  }
};


if (loading) return <div className="profile-header">🔄 프로필 로딩 중...</div>;






  // 계절 변경 함수
  const changeSeason = (newSeason) => {
    setSeason(newSeason);
    generateFallingElements(newSeason);
  };

  // 랜덤한 떨어지는 요소 생성
  const generateFallingElements = (currentSeason) => {
    const elements = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      emoji: seasonStyles[currentSeason].emoji,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 3 + 3}s` // 3~6초 사이의 랜덤 지속시간
    }));
    setFallingElements(elements);
  };

  // 초기 로딩 시 떨어지는 요소 생성
  useEffect(() => {
    generateFallingElements(season);
  }, []);


  return (
    <div className="profile-header" style={{ background: seasonStyles[season].background }}>
      {/* 🟡 떨어지는 계절 이펙트 */}
      <div className="falling-container">
        {fallingElements.map((element) => (
          <div
            key={element.id}
            className={`falling-effect ${seasonStyles[season].effectClass}`}
            style={{
              left: element.left,
              animationDuration: element.animationDuration
            }}
          >
            {element.emoji}
          </div>
        ))}
      </div>

      {/* 🟡 계절 변경 버튼 */}
      <div className="season-buttons">
        <button className="spring-btn" onClick={() => changeSeason("spring")}>🌸</button>
        <button className="summer-btn" onClick={() => changeSeason("summer")}>🌞</button>
        <button className="autumn-btn" onClick={() => changeSeason("autumn")}>🍂</button>
        <button className="winter-btn" onClick={() => changeSeason("winter")}>❄</button>
      </div>

      {/* 🟡 프로필 정보 */}
      <div className="profile-content">
      {/* 프로필 이미지 */}
        <div className="profile-avatar-container">
          <img src={profileData?.profileImage || "/default_profile.png"} alt="프로필" className="profile-avatar" />
          {isOwnProfile && (
            <button className="edit-icon" onClick={() => setIsImageEditing(true)}>📷</button>
          )}
        </div>
        <div className="profile-details">
          <div className="profile-username">
            {profileData?.nickname}
            {isOwnProfile && (
              <button className="edit-icon" onClick={() => setIsEditing(true)}>✏</button>
            )}
            </div>
          <div className="profile-info">
          <span>구독자수: <strong>{profileData?.subscribers || 0}</strong></span>
          <span>게시물: <strong>{profileData?.posts || 0}</strong></span>
            {/* <span>구독자수: <strong>{subscribers}</strong></span>
            <span>게시물: <strong>{posts}</strong></span> */}
          </div>
          {/* 선호/기피 버튼 */}
          <button className="preference-button" onClick={onOpenPreference}>선호/기피</button>
        </div>
      </div>

      {/* 🟡 닉네임 수정 모달 */}
      {isEditing && (
        <div className="nickname-modal-overlay">
          <div className="nickname-modal">
            <h3>닉네임 수정</h3>
            <input
              type="nickname-text"
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
              placeholder="새 닉네임 입력"
            />
            {errorMessage && <p className="nickname-error-message">{errorMessage}</p>}
            <div className="nickname-modal-buttons">
              <button className="nickname-btn-save" onClick={handleNicknameChange}>확인</button>
              <button className="nickname-btn-cancel" onClick={() => setIsEditing(false)}>취소</button>
            </div>
          </div>
        </div>
      )}


      {/* 프로필 이미지 수정 모달 */}
      {isImageEditing && (
        <div className="image-modal-overlay">
          <div className="image-modal">
            <h3>프로필 이미지 수정</h3>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {selectedImage && <p>{selectedImage.name}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <div className="image-modal-buttons">
              <button className="btn-save" onClick={uploadProfileImage}>업로드</button>
              <button className="btn-cancel" onClick={() => setIsImageEditing(false)}>취소</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProfileHeader;
