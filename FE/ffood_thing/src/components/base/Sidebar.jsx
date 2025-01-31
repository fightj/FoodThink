import React from "react"
import { Dropdown } from "react-bootstrap" // react-bootstrap에서 Dropdown 가져오기
import "../../styles/base/Sidebar.css"

function Sidebar({ isOpen, toggleSidebar }) {
  if (!isOpen) return null

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
        <span className="fs-4">홈 아이콘</span>
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
        <li>
          <a href="/profile/1" className="nav-link text-white">
            마이페이지
          </a>
        </li>
      </ul>
      <hr />
      <Dropdown className="dropdown">
        <Dropdown.Toggle
          variant="link"
          id="user-dropdown"
          className="d-flex align-items-center text-white text-decoration-none"
        >
          <img src="https://github.com/mdo.png" alt="" width="32" height="32" className="rounded-circle me-2" />
          <strong>User</strong>
        </Dropdown.Toggle>

        <Dropdown.Menu className="dropdown-menu-dark text-small shadow">
          <Dropdown.Item href="/profile/1?tab=bookmarks">북마크한 레시피</Dropdown.Item>
          <Dropdown.Item href="/profile/1?tab=recipes">내 레시피</Dropdown.Item>
          <Dropdown.Item href="/profile/1?tab=feed">내 피드</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item href="/">Log Out</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}

export default Sidebar
