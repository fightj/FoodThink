import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import BackgroundEffect from "./BackgroundEffect";
import Preference from "./Preference";
import Swal from "sweetalert2";
import SubscriberModal from "./SubscriberModal";
import "../../styles/profile/ProfileHeader.css";



const ProfileHeaderMe = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  
  const [season, setSeason] = useState("spring");
  const [background, setBackground] = useState("#FFEBE9"); // 기본 배경 설정
  
  const [isEditing, setIsEditing] = useState(false);
  const [newNickname, setNewNickname] = useState(user.nickname);
  const [isImageEditing, setIsImageEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showPreference, setShowPreference] = useState(false);
  const [postCount, setPostCount] = useState(0);
  // const [isSubscriberModalOpen, setIsSubscriberModalOpen] = useState(false);
  // const [isSubscribed, setIsSubscribed] = useState(false);



// ✅ 프로필 데이터 불러오기 (닉네임 기반)
const fetchProfileData = async () => {
  if (isOwnProfile) return; // 본인 프로필이면 API 호출 불필요

  try {
    const response = await fetch(`https://i12e107.p.ssafy.io/api/users/read/another-info/${nickname}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("프로필 데이터를 불러오는 데 실패했습니다.");
    }

    const data = await response.json();
    setProfileData(data);
  } catch (error) {
    console.error("❌ 프로필 불러오기 실패:", error);
  } finally {
    setLoading(false);
  }
};



  // ✅ 게시물 개수 가져오기
  const fetchPostCount = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const response = await fetch("https://i12e107.p.ssafy.io/api/myOwnRecipe/read/myRecipeList", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`게시물 개수 조회 실패: ${response.status}`);

      const data = await response.json();
      setPostCount(data.length);
    } catch (error) {
      console.error("❌ 게시물 개수 불러오기 실패:", error);
    }
  };


  // 닉네임 변경 요청
  const handleNicknameChange = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

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
      setUser({ ...user, nickname: newNickname });
      fetchProfileData();
    } catch (error) {
      setErrorMessage("중복되는 닉네임입니다!");
      Swal.fire("앗!", "고민하는 사이에 다른 유저가 닉네임을 가져갔어요!", "error");
    }
  };


  // 프로필 이미지 변경 핸들러
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
    if (!token) return;

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
      const newImageUrl = `${data.image}?timestamp=${new Date().getTime()}`; // `image` 필드 사용

      setProfileData((prev) => ({ ...prev, image: newImageUrl }));
      setUser((prevUser) => ({ ...prevUser, image: newImageUrl })); // UserContext 업데이트

      setIsImageEditing(false);
      setSelectedImage(null);

      Swal.fire("성공!", "멋진 사진으로 변신했어요! 📸", "success");
    } catch (error) {
      Swal.fire("실패! 😢", "이미지를 선택해주세요!", "error");
    }
  };

  // 회원 탈퇴 함수
  const handleDeleteAccount = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    Swal.fire({
      title: `${profileData.nickname || "회원"}님과의 이별인가요? 😢`,
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
          });

          if (!response.ok) {
            throw new Error(`회원 탈퇴 실패: ${response.status}`);
          }

          Swal.fire("회원 탈퇴 완료", "그동안 이용해주셔서 감사합니다.", "success").then(() => {
            localStorage.clear();
            navigate("/login");
          });
        } catch (error) {
          Swal.fire("히히 못 도망가.", "", "error");
        }
      }
    });
  };

// ✅ 구독 상태 확인 (닉네임 기반)
// const checkSubscriptionStatus = async () => {
//   if (isOwnProfile) return;
//   const token = localStorage.getItem("accessToken");

//   try {
//     const response = await fetch(`https://i12e107.p.ssafy.io/api/subscription/status/${nickname}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!response.ok) {
//       throw new Error("구독 상태 확인 실패");
//     }

//     const data = await response.json();
//     setIsSubscribed(data.isSubscribed);
//   } catch (error) {
//     console.error("❌ 구독 상태 확인 실패:", error);
//   }
// };

  // useEffect (프로필 데이터 갱신)
  useEffect(() => {
    fetchPostCount(); // 게시물 개수도 가져오기
  }, []);


  return (
    <div className="profile-header" style={{ background }}> {/* ✅ 배경색 적용 */}
      {/* 배경 이펙트 추가 */}
      <BackgroundEffect season={season} setSeason={setSeason} setBackground={setBackground} />
      {/* 프로필 정보 */}
      <div className="profile-content">
        {/* 프로필 이미지 */}
        <div className="profile-avatar-container">
          <img src={user?.image || "/default_profile.png"} alt="프로필" className="profile-avatar" key={user?.image} />
            <button className="edit-icon" onClick={() => setIsImageEditing(true)}>✏️</button>
        </div>
        <div className="profile-details">
        <div className="profile-username">
            {user?.nickname}
            <button className="edit-icon" onClick={() => setIsEditing(true)}>✏️</button>
          </div>
          <div className="profile-info">
            {/* <span
              onClick={isOwnProfile ? () => setIsSubscriberModalOpen(true) : null}
              style={{
                cursor: isOwnProfile ? "pointer" : "default",
                textDecoration: "none",
              }}
            >
              구독: <strong>{profileData?.subscribers || 0}</strong>
            </span> */}
            <span>게시물 수: <strong>{postCount}</strong></span> {/* 게시물 수 추가 */}
          </div>
          {/* 본인 프로필일 때만 선호/기피 버튼 표시 */}
            {/* 선호/기피 설정 */}
          <button className="preference-button" onClick={() => setShowPreference(true)}>선호/기피</button>
          {showPreference && <Preference onClose={() => setShowPreference(false)} />}
        </div>

        {/* 회원 탈퇴 버튼 */}
        <div className="profile-actions">
          <button className="btn btn-danger delete-btn" onClick={handleDeleteAccount}>회원 탈퇴</button>
        </div>
      </div>

      {/* 닉네임 수정 모달 */}
      {isEditing && (
        <div className="nickname-modal-overlay">
          <div className="nickname-modal">
            <h3>닉네임 수정</h3>
            <input type="text" value={newNickname} onChange={(e) => setNewNickname(e.target.value)} />
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

      {/* ✅ 구독자 리스트 모달 */}
      {/* {isSubscriberModalOpen && (
        <SubscriberModal
          subscribers={profileData?.subscribersList || []}
          onClose={() => setIsSubscriberModalOpen(false)}
        />
      )} */}
    </div>
  );
};

export default ProfileHeaderMe;
