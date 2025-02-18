import React, { useState, useEffect, useRef,useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import "../../styles/base/Sidebar.css"; // ✅ CSS 파일 추가

function Sidebar({ isOpen, toggleSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const prevScrollPos = useRef(0);
  // ✅ UserContext에서 최신 유저 정보 가져오기
  const { user, setUser } = useContext(UserContext);

  // ✅ 세션 스토리지에서도 유저 정보를 가져와 닉네임을 최신 상태로 유지
  const sessionUser = JSON.parse(sessionStorage.getItem("user"));
  const sessionUserNickname = user?.nickname || sessionUser?.nickname || "User";

  // ✅ 로그인 여부를 localStorage에서 확인
  const isLoggedIn = localStorage.getItem("kakaoAuthProcessed") === "true";

  // 사이드바가 닫힐 때 드롭다운도 함께 닫기
  useEffect(() => {
    if (!isOpen) {
      setDropdownOpen(false);
    }
  }, [isOpen]);

  // ✅ 페이지 이동 시 사이드바 & 드롭다운 닫기
  useEffect(() => {
    // if (isOpen) toggleSidebar(false);
    if(isOpen) setIsOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  // ✅ 스크롤 시 사이드바 & 드롭다운 자동 닫기
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isScrollingDown = currentScrollPos > prevScrollPos.current;

      if (isScrollingDown) {
        // toggleSidebar(false);
        setIsOpen(false);
      }
      prevScrollPos.current = currentScrollPos;
    };

    if (isOpen) {
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen]);

  const handleLogout = () => {
    // localStorage.removeItem("accessToken");
    // localStorage.removeItem("kakaoAuthProcessed");
    // sessionStorage.removeItem("user");
    localStorage.clear();
    sessionStorage.clear();
    toggleSidebar(false);
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <div className={`sidebar-container ${isOpen ? "show" : "hide"}`}>
      {/* ✅ 기본 사이드바 */}
      <div className="sidebar">
        <a href="/" className="home-link">홈</a>
        <hr />

        {isLoggedIn ? (
          <>
            <ul className="nav-list">
              <li><a href="/recipes/write">레시피 작성</a></li>
              <li><a href="/feed/write">피드 작성</a></li>
              <li><a href="/ai-recommend">AI 추천받기</a></li>
              <li><a href={`/profile/${localStorage.getItem("nickname")}`}>마이페이지</a></li>
            </ul>
            <hr />

            {/* ✅ 프로필 버튼 */}
            <button
              className="profile-button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <img
                src={
                  localStorage.getItem("profileImage")
                    ? `${localStorage.getItem("profileImage")}?timestamp=${new Date().getTime()}`
                    : "/images/default_profile.png"
                }
                alt="프로필"
                className="profile-img"
              />
              <strong>{sessionUserNickname || "User"}</strong>
              {/* ✅ 드롭다운 방향 표시 아이콘 추가 */}
              <span className={`dropdown-arrow ${dropdownOpen ? "open" : ""}`}>›</span>
            </button>
          </>
        ) : (
          <button className="login-btn" onClick={() => { navigate("/login"); toggleSidebar(false); }}>
            로그인해주세요
          </button>
        )}
      </div>

      {/* ✅ 프로필 드롭다운 */}
      {isLoggedIn && (
        <div className={`profile-dropdown ${dropdownOpen ? "open" : ""}`}>
          <a href={`/profile/${localStorage.getItem("nickname")}?tab=bookmarks`} onClick={() => setDropdownOpen(false)}>북마크한 레시피</a>
          <a href={`/profile/${localStorage.getItem("nickname")}?tab=recipes`} onClick={() => setDropdownOpen(false)}>내 레시피</a>
          <a href={`/profile/${localStorage.getItem("nickname")}?tab=feed`} onClick={() => setDropdownOpen(false)}>내 피드</a>
          <hr />
          <a href="#" onClick={handleLogout}>로그아웃</a>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
