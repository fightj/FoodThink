import React, { useContext, useState, useEffect, useRef } from "react";
import { Dropdown } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import "../../styles/base/Sidebar.css";

function Sidebar({ isOpen, toggleSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useContext(UserContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const prevScrollPos = useRef(0);

  // ✅ 페이지 이동 시 사이드바 & 드롭다운 닫기 (자동으로 열리지 않도록)
  useEffect(() => {
    if (isOpen) toggleSidebar(false); // 사이드바가 열려 있을 때만 닫음
    if (dropdownOpen) setDropdownOpen(false); // 드롭다운도 열려 있을 때만 닫음
  }, [location.pathname]); // ✅ 경로 변경 시 실행됨

  // ✅ 스크롤 시 사이드바 & 드롭다운 자동 닫기
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isScrollingDown = currentScrollPos > prevScrollPos.current;

      if (isScrollingDown) {
        if (isOpen) toggleSidebar(false);
        if (dropdownOpen) setDropdownOpen(false);
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

  let sessionUser = null;
  try {
    sessionUser = JSON.parse(sessionStorage.getItem("user"));
  } catch (error) {
    console.error("세션 유저 정보를 불러오는 중 오류 발생:", error);
  }

  const sessionUserNickname = user?.nickname || sessionUser?.nickname || null;

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    sessionStorage.removeItem("user");
    setUser(null);
    toggleSidebar(false);
    navigate("/login");
  };

  return (
    <div
      className={`sidebar d-flex flex-column flex-shrink-0 p-3 text-bg-dark ${isOpen ? "show" : "hide"}`}
      style={{
        width: "220px",
        maxWidth: "90%",
        position: "fixed",
        bottom: isOpen ? "20px" : "-100%",
        left: "10px",
        maxHeight: "calc(100vh - 40px)",
        height: "auto",
        zIndex: isOpen ? "1060" : "900",
        borderRadius: "10px",
        overflowY: "auto",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        transition: "bottom 0.4s ease-in-out, z-index 0.2s ease-in-out",
      }}
    >
      <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
        <span className="fs-4">홈</span>
      </a>
      <hr />

      {user ? (
        <>
          <ul className="nav nav-pills flex-column mb-auto">
            <li>
              <a href="/recipes/write" className="nav-link text-white">레시피 작성</a>
            </li>
            <li>
              <a href="/feed/write" className="nav-link text-white">피드 작성</a>
            </li>
            <li>
              <a href="/ai-recommend" className="nav-link text-white">AI 추천받기</a>
            </li>
            {sessionUserNickname && (
              <li>
                <a href={`/profile/${sessionUserNickname}`} className="nav-link text-white">마이페이지</a>
              </li>
            )}
          </ul>
          <hr />

          {/* ✅ 유저 프로필 드롭다운 */}
          <Dropdown className="dropdown" show={dropdownOpen}>
            <Dropdown.Toggle 
              variant="link" 
              id="user-dropdown" 
              className="d-flex align-items-center text-white text-decoration-none"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <img 
                src={user?.image && user.image.trim() ? `${user.image}?timestamp=${new Date().getTime()}` : "/images/default_profile.png"} 
                alt="프로필" 
                width="32" 
                height="32" 
                className="rounded-circle me-2" 
              />
              <strong>{sessionUserNickname || "User"}</strong>
            </Dropdown.Toggle>

            <Dropdown.Menu 
              className="dropdown-menu-dark text-small shadow"
              onClick={() => setDropdownOpen(false)}
            >
              <Dropdown.Item href={`/profile/${sessionUserNickname}?tab=bookmarks`} onClick={() => toggleSidebar(false)}>
                북마크한 레시피
              </Dropdown.Item>
              <Dropdown.Item href={`/profile/${sessionUserNickname}?tab=recipes`} onClick={() => toggleSidebar(false)}>
                내 레시피
              </Dropdown.Item>
              <Dropdown.Item href={`/profile/${sessionUserNickname}?tab=feed`} onClick={() => toggleSidebar(false)}>
                내 피드
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>로그아웃</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </>
      ) : (
        <button className="btn btn-light w-100 mt-3" onClick={() => { navigate("/login"); toggleSidebar(false); }}>
          로그인해주세요
        </button>
      )}
    </div>
  );
}

export default Sidebar;
