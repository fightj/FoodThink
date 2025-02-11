import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import BackgroundEffect from "./BackgroundEffect";
import Preference from "./Preference";
import SubscriberModal from "./SubscriberModal";
import Swal from "sweetalert2";
import "../../styles/profile/ProfileHeader.css";

const ProfileHeaderMe = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [season, setSeason] = useState("spring");
  const [background, setBackground] = useState("#FFEBE9"); // 기본 배경 설정
  const [isEditing, setIsEditing] = useState(false);
  const [newNickname, setNewNickname] = useState(user?.nickname || "");
  const [errorMessage, setErrorMessage] = useState(""); // ✅ 에러 메시지 상태 추가
  const [isImageEditing, setIsImageEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showPreference, setShowPreference] = useState(false);
  const [postCount, setPostCount] = useState(0);
  const [subscriberCount, setSubscriberCount] = useState(0); // ✅ 구독자 수 상태 추가
  const [isSubscriberModalOpen, setIsSubscriberModalOpen] = useState(false);
  const [subscribersList, setSubscribersList] = useState([]); // ✅ 구독자 리스트 상태 추가


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

      if (!response.ok) throw new Error("게시물 개수 조회 실패");

      const data = await response.json();
      setPostCount(data.length);
    } catch (error) {
      console.error("❌ 게시물 개수 불러오기 실패:", error);
    }
  };

  // ✅ 닉네임 변경
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
        throw new Error("닉네임 변경 실패");
      }

      Swal.fire("닉네임 변경 성공!", `'${newNickname}' 님으로 변경되었습니다!`, "success").then(() => {
        setIsEditing(false);
        const updatedUser = { ...user, nickname: newNickname };
        setUser(updatedUser);

        // ✅ 세션 스토리지도 최신 닉네임으로 업데이트
        sessionStorage.setItem("user", JSON.stringify(updatedUser));

        navigate(`/profile/${newNickname}`);
      });
    } catch (error) {
      Swal.fire("앗!", "닉네임이 중복되었습니다!", "error");
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

      setUser((prevUser) => {
        const updatedUser = { ...prevUser, image: newImageUrl };
        sessionStorage.setItem("user", JSON.stringify(updatedUser)); // ✅ 세션 스토리지 업데이트
        return updatedUser;
      });

      setIsImageEditing(false);
      setSelectedImage(null);

      Swal.fire("성공!", "멋진 사진으로 변신했어요! 📸", "success");
    } catch (error) {
      Swal.fire("실패! 😢", "이미지를 선택해주세요!", "error");
    }
  };

  // ✅ 회원 탈퇴
  const handleDeleteAccount = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    Swal.fire({
      title: "정말 탈퇴하시겠습니까?",
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
            throw new Error("회원 탈퇴 실패");
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

  // ✅ 구독자 수 가져오기 (닉네임 없을 경우 요청 안 보냄)
  const fetchSubscriberCount = async () => {
    if (!user?.nickname) return; // 닉네임이 없으면 실행 안 함
    // console.log(user.nickname)

    try {
      const response = await fetch(`https://i12e107.p.ssafy.io/api/subscribe/read/count/${user.nickname}`, {
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

  // ✅ 구독자 리스트 가져오기 (로그인 상태에서만 실행)
  const fetchSubscribersList = async () => {
    const token = localStorage.getItem("accessToken"); // ✅ 토큰 가져오기
    if (!token) return;

    try {
      const response = await fetch("https://i12e107.p.ssafy.io/api/subscribe/read", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // ✅ 로그인 필요 시 인증 추가
        },
      });

      if (!response.ok) {
        throw new Error("구독자 리스트 조회 실패");
      }

      const data = await response.json();
      setSubscribersList(data.subscribers);
      setIsSubscriberModalOpen(true); // ✅ 모달 열기
    } catch (error) {
      console.error("❌ 구독자 리스트 불러오기 실패:", error);
    }
  };

  // ✅ useEffect (닉네임 변경 시 게시물 개수 & 구독자 수 갱신)
  useEffect(() => {
    if (user?.nickname) {
      fetchPostCount();
      fetchSubscriberCount();
    }
  }, [user.nickname]); // ✅ 닉네임 변경될 때만 실행


  return (
    <div className="profile-header" style={{ background }}>
      <BackgroundEffect season={season} setSeason={setSeason} setBackground={setBackground} />
      <div className="profile-content">
        {/* 프로필 이미지 */}
        <div className="profile-avatar-container">
          <img src={`${user?.image}?timestamp=${new Date().getTime()}` || "/default_profile.png"} alt="프로필" className="profile-avatar" />
          <button className="edit-icon" onClick={() => setIsImageEditing(true)}>✏️</button>
        </div>
        <div className="profile-details">
          <div className="profile-username">
            {user?.nickname}
            <button className="edit-icon" onClick={() => setIsEditing(true)}>✏️</button>
          </div>
          <div className="profile-info">
            {/* ✅ 구독 수 추가 (클릭 시 구독 리스트 모달 열기) */}
            <span
              onClick={fetchSubscribersList}
              style={{
                cursor: "pointer",
                textDecoration: "underline",
                marginRight: "15px",
              }}
            >
              구독: <strong>{subscriberCount}</strong>
            </span>
            <span>게시물 수: <strong>{postCount}</strong></span>
          </div>
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
            <div className="image-modal-buttons">
              <button className="btn-save" onClick={uploadProfileImage}>업로드</button>
              <button className="btn-cancel" onClick={() => setIsImageEditing(false)}>취소</button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ 구독자 리스트 모달 */}
      {isSubscriberModalOpen && (
        <SubscriberModal
          subscribers={subscribersList}
          onClose={() => setIsSubscriberModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ProfileHeaderMe;
