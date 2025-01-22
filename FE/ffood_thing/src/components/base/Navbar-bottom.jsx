import React, { useState, useEffect } from "react"
import "../../styles/base/Navbar-bottom.css"
import { useNavigate } from "react-router-dom"

function NavbarBottom() {
  const [visible, setVisible] = useState(true)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [prevScrollPos, setPrevScrollPos] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY

      // 스크롤 방향 확인
      const isScrollingDown = currentScrollPos > prevScrollPos

      // 스크롤이 맨 위거나 스크롤 업일 때 네브바 보이기
      if (currentScrollPos < 10 || !isScrollingDown) {
        setVisible(true)
      } else {
        setVisible(false)
      }

      setPrevScrollPos(currentScrollPos)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [prevScrollPos])

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const navigate = useNavigate()

  return (
    <nav className={`bottom-navbar ${visible ? "bottom-navbar-visible" : "bottom-navbar-hidden"}`}>
      <div className="container-fluid">
        <div className="navbar-section">
          <ul className="navbar-nav">
            <li className="nav-item">
              <i className="bi bi-card-list" onClick={toggleDropdown}></i>
              {isDropdownOpen && (
                <div
                  className="dropdown-menu show"
                  style={{
                    position: "absolute",
                    bottom: "100%",
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
            <li className="nav-item" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
              <i className="bi bi-house-fill"></i>
            </li>
          </ul>
        </div>

        <div className="navbar-section">
          <ul className="navbar-nav">
            <li className="nav-item" onClick={() => navigate("/sns")} style={{ cursor: "pointer" }}>
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
