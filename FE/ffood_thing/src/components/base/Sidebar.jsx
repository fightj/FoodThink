import React, { useContext, useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import "../../styles/base/Sidebar.css";

function Sidebar({ isOpen, toggleSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useContext(UserContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // ✅ 세션 스토리지에서도 유저 정보를 가져와 닉네임을 최신 상태로 유지
  const sessionUser = JSON.parse(sessionStorage.getItem("user"));
  const sessionUserNickname = user?.nickname || sessionUser?.nickname || null;

  // ✅ 페이지 이동 시 일정 시간 후 사이드바 닫기 (부드럽게 전환)
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        toggleSidebar(false);
      }, 150);
    }
  }, [location.pathname]);

  // ✅ 로그아웃 핸들러
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
        bottom: isOpen ? "20px" : "-300px", // ✅ 밑에서 올라오는 애니메이션
        left: "10px",
        maxHeight: "calc(100vh - 40px)",
        height: "auto",
        zIndex: isOpen ? "1060" : "900", // ✅ 기본적으로 뒤에 있다가, 열릴 때 앞으로 나옴
        borderRadius: "10px",
        overflowY: "auto",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        transition: "bottom 0.4s ease-in-out, z-index 0.2s ease-in-out", // ✅ z-index도 부드럽게 변경됨
      }}
    >
      {/* ✅ 사이드바 공통: 홈 버튼 */}
      <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
        <span className="fs-4">홈</span>
      </a>
      <hr />

      {/* ✅ 로그인 상태일 때만 메뉴 표시 */}
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
          <Dropdown className="dropdown" show={dropdownOpen} onToggle={(isOpen) => setDropdownOpen(isOpen)}>
            <Dropdown.Toggle 
              variant="link" 
              id="user-dropdown" 
              className="d-flex align-items-center text-white text-decoration-none"
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

            <Dropdown.Menu className="dropdown-menu-dark text-small shadow">
              <Dropdown.Item href={`/profile/${sessionUserNickname}?tab=bookmarks`} onClick={() => toggleSidebar(false)}>북마크한 레시피</Dropdown.Item>
              <Dropdown.Item href={`/profile/${sessionUserNickname}?tab=recipes`} onClick={() => toggleSidebar(false)}>내 레시피</Dropdown.Item>
              <Dropdown.Item href={`/profile/${sessionUserNickname}?tab=feed`} onClick={() => toggleSidebar(false)}>내 피드</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>로그아웃</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </>
      ) : (
        // ✅ 로그아웃 상태일 때 로그인 버튼만 표시
        <button className="btn btn-light w-100 mt-3" onClick={() => { navigate("/login"); toggleSidebar(false); }}>
          로그인해주세요
        </button>
      )}
    </div>
  );
}

export default Sidebar;
