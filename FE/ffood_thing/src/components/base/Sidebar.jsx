import React, { useContext } from "react"
import { Dropdown } from "react-bootstrap"
import { UserContext } from "../../contexts/UserContext"
import "../../styles/base/Sidebar.css"

function Sidebar({ isOpen, toggleSidebar }) {
  if (!isOpen) return null


  // ✅ UserContext에서 최신 유저 정보 가져오기
  const { user, setUser } = useContext(UserContext);
  
  // ✅ 세션 스토리지에서도 유저 정보를 가져와 닉네임을 최신 상태로 유지
  const sessionUser = JSON.parse(sessionStorage.getItem("user"));
  const sessionUserNickname = user?.nickname || sessionUser?.nickname || "User";

  // ✅ 로그아웃 핸들러 (sessionStorage와 localStorage 초기화)
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("isNewUser");
    setUser(null);
    window.location.reload(); // 로그아웃 후 새로고침 (새로운 상태 반영)
  };

  return (
    <div
      className="sidebar d-flex flex-column flex-shrink-0 p-3 text-bg-dark"
      style={{
        width: "220px",
        maxWidth: "90%",
        position: "fixed",
        top: "300px",
        left: "10px",
        maxHeight: "calc(100vh - 40px)",
        height: "auto",
        zIndex: "1050",
        borderRadius: "10px",
        overflowY: "auto",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
      }}
    >
      <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
        <svg className="bi pe-none me-2" width="40" height="32">
          <use xlinkHref="#bootstrap" />
        </svg>
        <span className="fs-4">홈</span>
      </a>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li>
          <a href="/recipes/write" className="nav-link text-white">
            레시피 작성
          </a>
        </li>
        <li>
          <a href="/feed/write" className="nav-link text-white">
            피드 작성
          </a>
        </li>
        <li>
          <a href="/ai-recommend" className="nav-link text-white">
            AI 추천받기
          </a>
        </li>
        {/* ✅ 닉네임 기반 마이페이지 링크 */}
        {sessionUserNickname && (
          <li>
            <a href={`/profile/${sessionUserNickname}`} className="nav-link text-white">마이페이지</a>
          </li>
        )}
      </ul>
      <hr />
      <Dropdown className="dropdown">
        <Dropdown.Toggle variant="link" id="user-dropdown" className="d-flex align-items-center text-white text-decoration-none">
          <img src={`${user?.image}?timestamp=${new Date().getTime()}` || "/default_profile.png"} alt="" width="32" height="32" className="rounded-circle me-2" />
          <strong>{sessionUserNickname || "User"}</strong>
        </Dropdown.Toggle>

        <Dropdown.Menu className="dropdown-menu-dark text-small shadow">
        {sessionUserNickname && (
            <>
              <Dropdown.Item href={`/profile/${sessionUserNickname}?tab=bookmarks`}>북마크한 레시피</Dropdown.Item>
              <Dropdown.Item href={`/profile/${sessionUserNickname}?tab=recipes`}>내 레시피</Dropdown.Item>
              <Dropdown.Item href={`/profile/${sessionUserNickname}?tab=feed`}>내 피드</Dropdown.Item>
              <Dropdown.Divider />
            </>
          )}
          {user ? (
            <Dropdown.Item onClick={handleLogout}>Log Out</Dropdown.Item>
          ) : (
            <Dropdown.Item href="/login">Log In</Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}

export default Sidebar
