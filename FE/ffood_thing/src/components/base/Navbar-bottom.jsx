import React, { useState, useEffect } from "react"
import "../../styles/base/Navbar-bottom.css"
import { useNavigate } from "react-router-dom"
import Sidebar from "./Sidebar"

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
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <nav className={`bottom-navbar ${visible ? "bottom-navbar-visible" : "bottom-navbar-hidden"}`}>
        <div className="container-fluid">
          <div className="navbar-section">
            <ul className="navbar-nav">
              <li className="nav-item" onClick={toggleSidebar}>
                <img className="sidebar-nav" src="/images/sidebar-nav.png" alt="" />
              </li>
            </ul>
          </div>

          <div className="navbar-section">
            <ul className="navbar-nav">
              <li className="nav-item" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                <img className="home-nav"src="/images/home-nav.png" alt="" />
              </li>
            </ul>
          </div>

          <div className="navbar-section">
            <ul className="navbar-nav">
              <li className="nav-item" onClick={() => navigate("/sns")} style={{ cursor: "pointer" }}>
                <img className="sns-nav"src="/images/sns-nav.png" alt="" />
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  )
}

export default NavbarBottom
