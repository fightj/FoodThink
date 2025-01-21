import React, { useState, useEffect } from "react"
import "./Navbar-bottom.css"
import { useNavigate } from "react-router-dom"

function NavbarBottom() {
  const [visible, setVisible] = useState(true) // 네브바의 표시 상태
  const [isDropdownOpen, setIsDropdownOpen] = useState(false) // 드롭업 메뉴 열기 상태

  useEffect(() => {
    let lastScrollY = window.pageYOffset // 마지막 스크롤 위치 추적

    const handleScroll = () => {
      if (window.pageYOffset > lastScrollY) {
        // 스크롤을 내리면 네브바 숨기기
        setVisible(false)
      } else {
        // 스크롤을 올리면 네브바 보이기
        setVisible(true)
      }
      lastScrollY = window.pageYOffset // 현재 스크롤 위치 저장
    }

    window.addEventListener("scroll", handleScroll) // 스크롤 이벤트 리스너 추가

    return () => {
      window.removeEventListener("scroll", handleScroll) // 컴포넌트 언마운트 시 이벤트 리스너 제거
    }
  }, [])

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen) // 드롭업 메뉴 상태 토글
  }

  const navigate = useNavigate()

  return (
    <nav className={`navbar navbar-expand-lg navbar-dark bg-dark ${visible ? "navbar-visible" : "navbar-hidden"}`}>
      <div className="container-fluid">
        {/* 아이콘 섹션들 */}
        <div className="navbar-section">
          <ul className="navbar-nav">
            <li className="nav-item">
              <i
                className="bi bi-card-list"
                onClick={toggleDropdown} // 아이콘 클릭 시 드롭업 토글
              ></i>
              {/* 드롭업 메뉴 */}
              {isDropdownOpen && (
                <div
                  className="dropdown-menu show"
                  style={{
                    position: "absolute",
                    bottom: "100%", // 드롭업 메뉴는 위로 뜨므로 bottom을 사용
                    left: "10px",
                    zIndex: 1000,
                  }}
                >
                  <a className="dropdown-item" href="#">
                    오늘의 메뉴
                  </a>
                  <a className="dropdown-item" href="#">
                    레시피
                  </a>
                  <a className="dropdown-item" href="#">
                    뭐넣지?
                  </a>
                </div>
              )}
            </li>
          </ul>
        </div>

        <div className="navbar-section">
          <ul className="navbar-nav">
            <li
              className="nav-item"
              onClick={() => navigate("/")} // 홈 경로로 이동
              style={{ cursor: "pointer" }} // 클릭 가능한 스타일
            >
              <i className="bi bi-house-fill"></i>
            </li>
          </ul>
        </div>

        <div className="navbar-section">
          <ul className="navbar-nav">
            <li
              className="nav-item"
              onClick={() => navigate("/sns")} // sns 경로로 이동
              style={{ cursor: "pointer" }} // 클릭 가능한 스타일
            >
              <i className="bi bi-chat-left-heart-fill"></i>
            </li>
          </ul>
        </div>

        <div className="navbar-section">
          <ul className="navbar-nav">
            <li className="nav-item">
              <button className="btn btn-outline-light" type="button">
                Sign In
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default NavbarBottom
