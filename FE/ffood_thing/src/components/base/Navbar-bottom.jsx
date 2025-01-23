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
        className="d-flex flex-column flex-shrink-0 bg-body-tertiary rounded-3"
        style={{ 
          width: '4.5rem', 
          height: 'calc(100vh - 300px)', // 상단과 하단에서 100px를 줄임
          position: 'fixed', 
          top: '150px', // 상단에서 약간 떨어뜨림 
          bottom: '150px', // 하단에서 약간 떨어뜨림
          left: 0, 
          zIndex: 1000,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)' // 그림자 효과
        }}
      >
          <a 
            href="/" 
            className="d-block p-3 link-body-emphasis text-decoration-none" 
            title="Icon-only"
          >
            <i className="bi bi-bootstrap"></i>
            <span className="visually-hidden">Icon-only</span>
          </a>
          <ul className="nav nav-pills nav-flush flex-column mb-auto text-center">
            <li className="nav-item">
              <a 
                href="#" 
                className="nav-link  py-3 border-bottom rounded-0" 
                title="Home"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/');
                }}
              >
                <i className="bi bi-house"></i>
              </a>
            </li>
            <li className="nav-item">
              <a 
                href="#" 
                className="nav-link  py-3 border-bottom rounded-0" 
                title="Home"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/');
                }}
              >
                <i className="bi bi-house"></i>
              </a>
            </li>
            <li className="nav-item">
              <a 
                href="#" 
                className="nav-link  py-3 border-bottom rounded-0" 
                title="Home"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/');
                }}
              >
                <i className="bi bi-house"></i>
              </a>
            </li>
            <li className="nav-item">
              <a 
                href="#" 
                className="nav-link  py-3 border-bottom rounded-0" 
                title="Home"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/');
                }}
              >
                <i className="bi bi-house"></i>
              </a>
            </li>
            <li className="nav-item">
              <a 
                href="#" 
                className="nav-link  py-3 border-bottom rounded-0" 
                title="Home"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/');
                }}
              >
                <i className="bi bi-house"></i>
              </a>
            </li>
          </ul>
          
        </div>
      )}

      <nav className={`bottom-navbar ${visible ? "bottom-navbar-visible" : "bottom-navbar-hidden"}`}>
        <div className="container-fluid">
          <div className="navbar-section">
            <ul className="navbar-nav">
              <li className="nav-item">
                <i className="bi bi-card-list" onClick={toggleSidebar}></i>
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
    </>
  )
}

export default NavbarBottom