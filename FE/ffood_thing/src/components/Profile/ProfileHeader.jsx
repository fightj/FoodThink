import React, { useState, useEffect } from "react";
import "../../styles/profile/ProfileHeader.css";
import Swal from "sweetalert2"; // ✅ SweetAlert 알림 추가

const ProfileHeader = ({ userId, isOwnProfile, onOpenPreference }) => {
  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newNickname, setNewNickname] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isImageEditing, setIsImageEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [season, setSeason] = useState("spring");
  const [fallingElements, setFallingElements] = useState([]);

  const seasonStyles = {
    spring: { background: "#FFEBE9", emoji: "🌸" },
    summer: { background: "#B3E5FC", emoji: "💧" },
    autumn: { background: "#FFD180", emoji: "🍂" },
    winter: { background: "#E3F2FD", emoji: "❄" }
  };

  // ✅ 랜덤한 떨어지는 요소 생성 함수
  const generateFallingElements = (currentSeason) => {
    const elements = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      emoji: seasonStyles[currentSeason].emoji,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 3 + 3}s`
    }));
    setFallingElements(elements);
  };

  // ✅ 프로필 데이터 불러오는 함수
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
      setProfileData((prev) => ({ ...prev, ...data }));
    } catch (error) {
      console.error("❌ 프로필 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ 닉네임 변경 요청
  const handleNicknameChange = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setErrorMessage("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await fetch("https://i12e107.p.ssafy.io/api/users/update/nickname", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nickname: newNickname }),
      });

      if (!response.ok) {
        throw new Error("닉네임 변경에 실패했습니다.");
      }

      const data = await response.json();
      setProfileData((prev) => ({ ...prev, nickname: data.nickname }));
      setIsEditing(false);
      setNewNickname(""); // ✅ 입력 필드 초기화
      setErrorMessage("");

      Swal.fire("닉네임 변경 완료!", "닉네임이 성공적으로 변경되었습니다.", "success");
    } catch (error) {
      setErrorMessage("서버 오류가 발생했습니다.");
      Swal.fire("오류", "닉네임 변경 중 문제가 발생했습니다.", "error");
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
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("프로필 이미지 변경에 실패했습니다.");
      }

      const data = await response.json();
      setProfileData((prev) => ({ ...prev, profileImage: data.image }));
      setIsImageEditing(false);
      setSelectedImage(null);

      Swal.fire("프로필 이미지 변경 완료!", "새로운 프로필 이미지가 적용되었습니다.", "success");
    } catch (error) {
      setErrorMessage("서버 오류가 발생했습니다.");
      Swal.fire("오류", "프로필 이미지 변경 중 문제가 발생했습니다.", "error");
    }
  };


  // ✅ useEffect 내부에서 실행
  useEffect(() => {
    fetchProfileData();
    generateFallingElements(season);
  }, [userId, season]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     await fetchProfileData();
  //     generateFallingElements(season);
  //   };

  //   if (userId) fetchData();
  // }, [userId, season]);

  if (loading) return <div className="profile-header">🔄 프로필 로딩 중...</div>;



  // const handleNicknameChange = async () => {
  //   const token = localStorage.getItem("accessToken");
  //   if (!token) {
  //     setErrorMessage("로그인이 필요합니다.");
  //     return;
  //   }
  //   try {
  //     const response = await fetch("https://i12e107.p.ssafy.io/api/users/update/nickname", {
  //       method: "PUT",
  //       // headers: {
  //       //   "Content-Type": "application/json",
  //       //   Authorization: `Bearer ${token}`,
  //       // },
  //       body: JSON.stringify({ nickname: newNickname }),
  //     });
  //     const data = await response.json();
  //     if (response.ok) {
  //       setProfileData((prev) => ({ ...prev, nickname: data.nickname }));
  //       setIsEditing(false);
  //       setErrorMessage("");
  //     } else {
  //       setErrorMessage(data.message || "닉네임 변경에 실패했습니다.");
  //     }
  //   } catch (error) {
  //     setErrorMessage("서버 오류가 발생했습니다.");
  //   }
  // };


  // 계절 변경 함수
  const changeSeason = (newSeason) => {
    setSeason(newSeason);
    generateFallingElements(newSeason);
  };



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
            <button className="edit-icon" onClick={() => setIsImageEditing(true)}>✏️</button>
          )}
        </div>
        <div className="profile-details">
          <div className="profile-username">
            {profileData?.nickname}
            {isOwnProfile && (
              <button className="edit-icon" onClick={() => setIsEditing(true)}>✏️</button>
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
