import React, { useState, useContext, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../../contexts/UserContext"
import BackgroundEffect from "./BackgroundEffect"
import Preference from "./Preference"
import SubscriberModal from "./SubscriberModal"
import Swal from "sweetalert2"
import "../../styles/profile/ProfileHeader.css"
import "../../styles/base/global.css"

const ProfileHeaderMe = () => {
  const navigate = useNavigate()
  const { user, setUser } = useContext(UserContext)
  const [season, setSeason] = useState("봄")
  const [background, setBackground] = useState("#FFEBE9") // 기본 배경 설정

  useEffect(() => {
    fetchUserSeason() // 페이지 로드 시 서버에서 유저 테마 가져오기
  }, [])

  // ✅ 서버에서 사용자 계절 정보 가져오기
  const fetchUserSeason = async () => {
    const token = localStorage.getItem("accessToken")
    if (!token) {
      console.error("❌ 토큰 없음: 로그인 필요")
      return
    }

    try {
      const response = await fetch("https://i12e107.p.ssafy.io/api/users/read/my-info", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorText = await response.text() // 서버 응답 확인
        throw new Error(`계절 정보 불러오기 실패: ${errorText}`)
      }

      const data = await response.json()
      console.log("✅ 서버에서 받은 계절 정보:", data)

      if (data.season) {
        setSeason(data.season) // ✅ UI 업데이트
      } else {
        console.warn("⚠ 서버에서 받은 계절 데이터가 없음. 기본값(봄) 설정")
        setSeason("봄")
      }
    } catch (error) {
      console.error("❌ 계절 불러오기 실패:", error)
      setSeason("봄") // 기본값
    }
  }

  // ✅ 서버에 계절 정보 업데이트
  const updateUserSeason = async (newSeason) => {
    const token = localStorage.getItem("accessToken")
    if (!token) {
      console.error("❌ 토큰 없음: 로그인 필요")
      return
    }

    try {
      const response = await fetch("https://i12e107.p.ssafy.io/api/users/update/season", {
        method: "PUT", // ✅ PUT 방식으로 요청
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ season: newSeason }), // ✅ 계절 정보 업데이트
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`계절 변경 실패: ${errorText}`)
      }

      console.log(`✅ 서버에 '${newSeason}' 테마 저장 완료!`)
      setSeason(newSeason) // ✅ UI 반영
      fetchUserSeason()
    } catch (error) {
      console.error("❌ 계절 변경 실패:", error)
    }
  }

  const [isEditing, setIsEditing] = useState(false)
  const [newNickname, setNewNickname] = useState(user?.nickname || "")
  const [errorMessage, setErrorMessage] = useState("") // ✅ 에러 메시지 상태 추가
  const [isImageEditing, setIsImageEditing] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [showPreference, setShowPreference] = useState(false)
  const [postCount, setPostCount] = useState(0)
  const [subscriberCount, setSubscriberCount] = useState(0) // ✅ 구독자 수 상태 추가
  const [isSubscriberModalOpen, setIsSubscriberModalOpen] = useState(false)
  const [subscribersList, setSubscribersList] = useState([]) // ✅ 구독자 리스트 상태 추가

  // ✅ 게시물 개수 가져오기
  const fetchPostCount = async () => {
    const token = localStorage.getItem("accessToken")
    if (!token) return

    try {
      const response = await fetch("https://i12e107.p.ssafy.io/api/myOwnRecipe/read/myRecipeList", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error("게시물 개수 조회 실패")

      const data = await response.json()
      setPostCount(data.length)
    } catch (error) {
      console.error("❌ 게시물 개수 불러오기 실패:", error)
    }
  }

  // ✅ 닉네임 변경
  const handleNicknameChange = async () => {
    const token = localStorage.getItem("accessToken")
    if (!token) return

    // ✅ 사용 불가능한 문자 정규식 (공백 및 특수 문자 제거)
    const invalidChars = /[@%&?\/\\#+=:;*|<>\s]/g
    if (invalidChars.test(newNickname)) {
      Swal.fire({title: "⚠️ 닉네임 오류", text: "닉네임에 공백 또는 특수문자를 사용할 수 없습니다.", icon:"error",
        customClass: {
          popup: "custom-swal-popup", // 공통 CSS 클래스 적용
        },
      })
      return
    }

    // ✅ 닉네임 앞뒤 공백 제거
    const sanitizedNickname = newNickname.trim()

    if (!sanitizedNickname) {
      Swal.fire({title: "⚠️ 닉네임 오류", text: "닉네임을 입력해주세요.", icon:"error",
        customClass: {
          popup: "custom-swal-popup", // 공통 CSS 클래스 적용
        },
      })
      return
    }

    try {
      const response = await fetch("https://i12e107.p.ssafy.io/api/users/update/nickname", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nickname: newNickname }),
      })

      if (!response.ok) {
        throw new Error("닉네임 변경 실패")
      }

      Swal.fire({title: "닉네임 변경 성공!", text: `이제부터는 '${newNickname}' 님이라고 불러드릴게요. 😎`, icon: "success",
        customClass: {
          popup: "custom-swal-popup", // 공통 CSS 클래스 적용
        },}).then(() => {
        setIsEditing(false)
        const updatedUser = { ...user, nickname: newNickname }
        setUser(updatedUser)

        // ✅ 세션 스토리지도 최신 닉네임으로 업데이트
        localStorage.setItem("nickname", newNickname)
        sessionStorage.setItem("user", JSON.stringify(updatedUser))

        navigate(`/profile/${newNickname}`)
        window.location.reload()
      })
    } catch (error) {
      Swal.fire({title: "앗!", text: "고민하는 사이에 다른 유저가 닉네임을 가져갔어요!", icon: "error",
        customClass: { popup: "custom-swal-popup" },
      })
    }
  }

  // ✅ 프로필 이미지 변경 핸들러
  const handleImageUpload = (event) => {
    console.log("파일 선택됨:", event.target.files[0]); // 선택된 파일 출력
    const file = event.target.files[0]
    if (file) {
      console.log("파일이 선택되었습니다:", file); // 로그 추가
      setSelectedImage(file)
    }
  }

  // useEffect - selectedImage가 변경될 때마다 uploadProfileImage 실행
  useEffect(() => {
    if (selectedImage) {
      console.log("이미지가 선택되었습니다:", selectedImage);
      uploadProfileImage(); // 이미지 선택 후 자동으로 업로드
    }
  }, [selectedImage]); // selectedImage 상태가 변경될 때마다 실행
  

  // ✅ 프로필 이미지 업로드 요청
  const uploadProfileImage = async () => {
    console.log("selectedImage: " + selectedImage)
    if (!selectedImage) {
      Swal.fire({title: "엥?", text: "이미지 업로드를 해주세요!", icon: "warning", 
        customClass: {
          popup: "custom-swal-popup", // 공통 CSS 클래스 적용
        },
      })
      return
    }

    const token = localStorage.getItem("accessToken")
    if (!token) return

    const formData = new FormData()
    formData.append("image", selectedImage)

    try {
      const response = await fetch("https://i12e107.p.ssafy.io/api/users/update/image", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error("프로필 이미지 변경 실패")
      }

      const data = await response.json()
      const newImageUrl = `${data.image}?timestamp=${new Date().getTime()}` // `image` 필드 사용

      setUser((prevUser) => {
        const updatedUser = { ...prevUser, image: newImageUrl }
        sessionStorage.setItem("user", JSON.stringify(updatedUser)) // ✅ 세션 스토리지 업데이트
        localStorage.setItem("profileImage", newImageUrl )
        return updatedUser
      })

      setIsImageEditing(false)
      setSelectedImage(null)
      

      Swal.fire({title: "성공!", text: "멋진 사진으로 변신했어요! 📸", icon: "success", customClass: { popup: "custom-swal-popup"}})
    } catch (error) {
      Swal.fire({title: "실패! 😢", text: "이미지를 선택해주세요!", icon: "error", customClass: { popup: "custom-swal-popup"}})
    }
  }

  // 버튼 클릭 시 파일 선택 창 열기
  const triggerFileInput = () => {
    document.getElementById("file-upload").click(); // input의 click 이벤트 호출
  };

  // ✅ 회원 탈퇴
  const handleDeleteAccount = async () => {
    const token = localStorage.getItem("accessToken")
    if (!token) return

    Swal.fire({
      title: `${user.nickname || "회원"}님과의 이별인가요? 😢`,
      text: "탈퇴 후에는 복구가 불가능합니다.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "탈퇴하기",
      cancelButtonText: "취소",
      customClass: { popup: "custom-swal-popup"},
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch("https://i12e107.p.ssafy.io/api/users/delete", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })

          if (!response.ok) {
            throw new Error("회원 탈퇴 실패")
          }

          Swal.fire({title: "회원 탈퇴 완료", text: "그동안 이용해주셔서 감사합니다.", icon: "success", customClass: { popup: "custom-swal-popup"}}).then(() => {
            localStorage.clear();
            sessionStorage.clear();
            navigate("/login");
          });
        } catch (error) {
          Swal.fire({title: "히히 못 도망가.", text: "", icon: "error", customClass: { popup: "custom-swal-popup"}})
        }
      }
    })
  }

  // ✅ 구독자 수 가져오기 (닉네임 없을 경우 요청 안 보냄)
  const fetchSubscriberCount = async () => {
    if (!user?.nickname) return // 닉네임이 없으면 실행 안 함
    // console.log(user.nickname)

    try {
      const response = await fetch(`https://i12e107.p.ssafy.io/api/subscribe/read/count/${user.nickname}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) {
        throw new Error("구독자 수 조회 실패")
      }

      const data = await response.json()
      setSubscriberCount(data.count) // ✅ 구독자 수 저장
    } catch (error) {
      console.error("❌ 구독자 수 불러오기 실패:", error)
    }
  }

  // ✅ 구독자 리스트 가져오기 (로그인 상태에서만 실행)
  const fetchSubscribersList = async () => {
    const token = localStorage.getItem("accessToken")
    if (!token) return

    try {
      const response = await fetch("https://i12e107.p.ssafy.io/api/subscribe/read", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("구독자 리스트 조회 실패")
      }

      const data = await response.json()
      console.log("✅ 서버에서 받은 구독 리스트:", data)

      // ✅ 서버 응답이 배열이 아닐 경우 배열로 변환
      // if (Array.isArray(data.subscribers)) {
      //   setSubscribersList(data.subscribers);
      // } else {
      //   setSubscribersList([data.subscribers]); // 배열이 아닐 경우 배열로 변환
      // }
      setSubscribersList(Array.isArray(data) ? data : [data])

      setIsSubscriberModalOpen(true) // ✅ 모달 열기
    } catch (error) {
      console.error("❌ 구독자 리스트 불러오기 실패:", error)
    }
  }

  // ✅ useEffect (닉네임 변경 시 게시물 개수 & 구독자 수 갱신)
  useEffect(() => {
    if (user?.nickname) {
      fetchPostCount()
      fetchSubscriberCount()
    }
  }, [user.nickname]) // ✅ 닉네임 변경될 때만 실행

  return (
    <div className="profile-header" style={{ background }}>
      <BackgroundEffect season={season} setSeason={setSeason} setBackground={setBackground} updateUserSeason={updateUserSeason} isEditable={true} />
      <div className="profile-content">
        {/* 프로필 이미지 */}
        <div className="profile-avatar-container">
          <img src={user?.image ? `${user.image}?timestamp=${new Date().getTime()}` : "/images/default_profile.png"} alt="프로필" className="profile-avatar" />
          <button className="edit-icon" onClick={triggerFileInput}>
            ✏️
          </button>
          <input type="file" accept="image/*" id="file-upload" onChange={handleImageUpload}  style={{display: "none"}} />
        </div>

        <div className="profile-details">
          <div className="profile-username">
            {user?.nickname}
            <button className="edit-icon" onClick={() => setIsEditing(true)}>
              ✏️
            </button>
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
            <span>
              게시물 수: <strong>{postCount}</strong>
            </span>
          </div>
          <button className="preference-button" onClick={() => setShowPreference(true)}>
            선호/기피
          </button>
          {showPreference && <Preference onClose={() => setShowPreference(false)} />}
        </div>

          {/* 회원 탈퇴 버튼 */}
          <div className="profile-actions">
            <button className="delete-btn" onClick={handleDeleteAccount}>
              회원 탈퇴
            </button>
          </div>
      </div>

      {/* 닉네임 수정 모달 */}
      {isEditing && (
        <div className="nickname-modal-overlay">
          <div className="nickname-modal">
            <h3>닉네임 수정</h3>
            <input
              type="text"
              value={newNickname}
              onChange={(e) => {
                const inputNickname = e.target.value.replace(/[@%&?\/\\#+=:;*|<>\s]/g, "") // ✅ 공백 및 특수문자 제거
                setNewNickname(inputNickname)
                setErrorMessage("") // 에러 메시지 초기화
              }}
            />
            {errorMessage && <p className="nickname-error-message">{errorMessage}</p>}
            <div className="nickname-modal-buttons">
              <button className="nickname-btn-save" onClick={handleNicknameChange}>
                확인
              </button>
              <button className="nickname-btn-cancel" onClick={() => setIsEditing(false)}>
                취소
              </button>
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
              <button className="btn-save" onClick={uploadProfileImage}>
                업로드
              </button>
              <button className="btn-cancel" onClick={() => setIsImageEditing(false)}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ 구독자 리스트 모달 */}
      {isSubscriberModalOpen && <SubscriberModal subscribers={subscribersList} onClose={() => setIsSubscriberModalOpen(false)} />}
    </div>
  )
}

export default ProfileHeaderMe
