import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import "../../styles/profile/ProfileHeader.css";
import Preference from "./Preference";
import Swal from "sweetalert2";

const ProfileHeader = ({ userId, isOwnProfile, onOpenPreference }) => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newNickname, setNewNickname] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isImageEditing, setIsImageEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [season, setSeason] = useState("spring");
  const [fallingElements, setFallingElements] = useState([]);
  const [showPreference, setShowPreference] = useState(false);

  const seasonStyles = {
    spring: { background: "#FFEBE9", effectClass: "falling-cherry-blossom", emoji: "🌸" },
    summer: { background: "#B3E5FC", effectClass: "falling-rain", emoji: "💧" },
    autumn: { background: "#FFD180", effectClass: "falling-leaves", emoji: "🍂" },
    winter: { background: "#E3F2FD", effectClass: "falling-snow", emoji: "❄" }
  };


  // ✅ 떨어지는 요소 생성
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
      setProfileData(data);
      setUser(data); // ✅ UserContext 업데이트
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

      Swal.fire("닉네임 변경 성공~!", `이제부터는 '${newNickname}' 님이라고 불러드릴게요. 😎`, "success");
      setIsEditing(false);
      setNewNickname("");
      fetchProfileData();
    } catch (error) {
      setErrorMessage("중복되는 닉네임입니다!");
      Swal.fire("앗!", "고민하는 사이에 다른 유저가 닉네임을 가져갔어요!", "error");
    }
  };

  // ✅ 프로필 이미지 변경 핸들러
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };


  const uploadProfileImage = async () => {
    if (!selectedImage) {
      Swal.fire("엥?", "이미지 업로드를 해주세요!", "warning");
      return;
    }
  
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
      throw new Error("프로필 이미지 변경 실패");
    }

    const data = await response.json();
    const newImageUrl = `${data.image}?timestamp=${new Date().getTime()}`; // ✅ `image` 필드 사용

    setProfileData((prev) => ({ ...prev, image: newImageUrl })); 
    setUser((prevUser) => ({ ...prevUser, image: newImageUrl })); // ✅ UserContext 업데이트

    setIsImageEditing(false);
    setSelectedImage(null);

    Swal.fire("성공!", "멋진 사진으로 변신했어요! 📸", "success");
  } catch (error) {
    setErrorMessage("서버 오류가 발생했습니다.");
    Swal.fire("실패! 😢", "이미지를 선택해주세요!", "error");
  }
};

  // ✅ 회원 탈퇴 함수
  const handleDeleteAccount = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      Swal.fire("로그인이 필요합니다.", "", "error");
      return;
    }

    Swal.fire({
      title: `${profileData.nickname||"회원"}님과의 이별인가요? 😢`,
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
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          // body: JSON.stringify({ userId }) // 필요한 경우
        });

          if (!response.ok) {
            throw new Error(`회원 탈퇴 실패: ${response.status}`);
          }

          Swal.fire("회원 탈퇴 완료", "그동안 이용해주셔서 감사합니다.", "success").then(() => {
            localStorage.clear();
            sessionStorage.clear();
            navigate("/login");
          });
        } catch (error) {
          console.error("❌ 회원 탈퇴 오류:", error);
          // Swal.fire("회원 탈퇴 중 오류가 발생했습니다.", "", "error");
          Swal.fire("히히 못 도망가.", "", "error");
        }
      }
    });
  };


  // 계절 변경 함수
  const changeSeason = (newSeason) => {
    setSeason(newSeason);
    generateFallingElements(newSeason);
  };

  // ✅ useEffect (프로필 데이터 갱신)
  useEffect(() => {
    fetchProfileData();
  }, [userId]); // ✅ userId가 변경될 때만 실행

    // ✅ useEffect (배경 애니메이션 분리)
    useEffect(() => {
      generateFallingElements(season);
    }, [season]); // ✅ season 변경 시만 실행

  if (loading) return <div className="profile-header">🔄 프로필 로딩 중...</div>;



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
          <img src={profileData?.image || "/default_profile.png"} alt="프로필" className="profile-avatar" key={profileData?.image} />
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
          {/* ✅ 본인 프로필일 때만 선호/기피 버튼 표시 */}
          {isOwnProfile && (
        <button className="preference-button" onClick={() => setShowPreference(true)}>
          선호/기피
        </button>
      )}
      {/* ✅ 모달 렌더링 */}
      {showPreference && <Preference onClose={() => setShowPreference(false)} userId={userId} />}
        </div>
        {/* ✅ 회원 탈퇴 버튼 추가 (우측 하단) */}
        {isOwnProfile && (
          <div className="profile-actions">
            <button className="btn btn-danger delete-btn" onClick={handleDeleteAccount}>
              회원 탈퇴
            </button>
          </div>
        )}
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
