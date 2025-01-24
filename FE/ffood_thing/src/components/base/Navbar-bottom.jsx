import React, { useState, useEffect } from "react"
import "../../styles/base/Navbar-bottom.css"
import { useNavigate } from "react-router-dom"

function NavbarBottom() {
  const [visible, setVisible] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [prevScrollPos, setPrevScrollPos] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY
      const isScrollingDown = currentScrollPos > prevScrollPos

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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const navigate = useNavigate()

  return (
    <>
      {isSidebarOpen && (
        <div
          className="sidebar d-flex flex-column flex-shrink-0 p-3 text-bg-dark"
          style={{
            width: "200px", // 기본 너비
            maxWidth: "90%", // 화면이 작아지면 너비 제한
            position: "fixed",
            top: "300px", // 위에서 떨어지게
            left: "10px", // 화면 왼쪽에서 약간 여백 추가
            maxHeight: "calc(100vh - 40px)", // 화면 전체 높이에서 위/아래 여백을 포함해 제한
            height: "auto", // 높이는 내용에 따라 동적으로 설정
            zIndex: "1050",
            borderRadius: "10px", // 모서리 둥글게
            overflowY: "auto", // 내용이 많을 경우 스크롤 추가
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", // 그림자 효과 추가
          }}
        >
          <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
            <svg className="bi pe-none me-2" width="40" height="32">
              <use xlinkHref="#bootstrap" />
            </svg>
            <span className="fs-4">Sidebar</span>
          </a>
          <hr />
          <ul className="nav nav-pills flex-column mb-auto">
            <li className="nav-item">
              <a href="#" className="nav-link active" aria-current="page">
                <svg className="bi pe-none me-2" width="16" height="16">
                  <use xlinkHref="#home" />
                </svg>
                Home
              </a>
            </li>
            <li>
              <a href="#" className="nav-link text-white">
                <svg className="bi pe-none me-2" width="16" height="16">
                  <use xlinkHref="#speedometer2" />
                </svg>
                Dashboard
              </a>
            </li>
            <li>
              <a href="#" className="nav-link text-white">
                <svg className="bi pe-none me-2" width="16" height="16">
                  <use xlinkHref="#table" />
                </svg>
                Orders
              </a>
            </li>
            <li>
              <a href="#" className="nav-link text-white">
                <svg className="bi pe-none me-2" width="16" height="16">
                  <use xlinkHref="#grid" />
                </svg>
                Products
              </a>
            </li>
            <li>
              <a href="#" className="nav-link text-white">
                <svg className="bi pe-none me-2" width="16" height="16">
                  <use xlinkHref="#people-circle" />
                </svg>
                Customers
              </a>
            </li>
          </ul>
          <hr />
          <div className="dropdown">
            <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
              <img src="https://github.com/mdo.png" alt="" width="32" height="32" className="rounded-circle me-2" />
              <strong>mdo</strong>
            </a>
            <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
              <li>
                <a className="dropdown-item" href="#">
                  New project...
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Settings
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Profile
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Sign out
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}

      <nav className={`bottom-navbar ${visible ? "bottom-navbar-visible" : "bottom-navbar-hidden"}`}>
        <div className="container-fluid">
          <div className="navbar-section">
            <ul className="navbar-nav">
              <li className="nav-item" onClick={toggleSidebar}>
                <i className="bi bi-card-list" style={{ cursor: "pointer" }}></i>
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
        </div>
      </nav>
    </>
  )
}

export default NavbarBottom
