// BackTab.jsx
import React from "react"
import { useNavigate } from "react-router-dom"
import { AiOutlineLeft } from "react-icons/ai" // 왼쪽 화살표 아이콘

const BackTab = () => {
  const navigate = useNavigate()

  const handleBackClick = () => {
    navigate(-1) // 이전 페이지로 돌아갑니다.
  }

  return (
    <div style={navStyle}>
      <button onClick={handleBackClick} style={buttonStyle}>
        <AiOutlineLeft size={24} /> {/* 아이콘 크기 조정 가능 */}
      </button>
    </div>
  )
}

// Navbar 전체 div 스타일
const navStyle = {
  width: "100%", // 가로 전체
  backgroundColor: "#f0f0f0", // 연한 회색 배경
  display: "flex",
  alignItems: "center",
  padding: "10px", // 상하 여백 추가
  boxSizing: "border-box", // 패딩이 포함되도록 설정
}

// 버튼 스타일
const buttonStyle = {
  border: "none",
  background: "transparent",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "8px",
}

export default BackTab
