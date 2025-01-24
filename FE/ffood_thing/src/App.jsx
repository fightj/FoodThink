import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "bootstrap-icons/font/bootstrap-icons.css" // Bootstrap Icons
import "./App.css"

//공통 스타일
import "./styles/base/global.css"

// 페이지 컴포넌트
import Home from "./pages/home/Home"
import SnsMain from "./pages/sns/SnsMain"
import FeedDetail from "./pages/sns/FeedDetail"
import FeedWrite from "./pages/sns/FeedWrite"
import RecipesMainPage from "./pages/recipe/RecipesMainPage"
import RecipeDetailPage from "./pages/recipe/RecipeDetailPage"
import "./App.css"
import { useState } from "react"
import Home from "./pages/home/Home" // Home 컴포넌트 임포트
import SnsMain from "./pages/sns/SnsMain" // SnsMain 컴포넌트 임포트
import NavbarBottom from "./components/base/Navbar-bottom" // nav바
import { Link } from "react-router-dom"
import FeedDetail from "./pages/sns/FeedDetail" // 피드 상세보기
import FeedWrite from "./pages/sns/FeedWrite" // 피드 작성성
import "bootstrap-icons/font/bootstrap-icons.css"
import ProfilePage from "./pages/profile/ProfilePage"
// import useAuth from "./hooks/useAuth"; // 현재 로그인한 사용자 정보 가져오기
// 공통 컴포넌트
const App = () => {
  // const { currentUser } = useAuth(); // 현재 로그인한 사용자 정보 가져오기
  return (
    <div>
      <Router>
        {/* 라우팅 설정 */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sns" element={<SnsMain />} />
          <Route path="/feed/:id" element={<FeedDetail />} />
          <Route path="/feed/write" element={<FeedWrite />} />
          <Route path="/recipes" element={<RecipesMainPage />} />
          <Route path="/recipes/:id" element={<RecipeDetailPage />} />
          
          <Route path="/profile/:id" element={<ProfilePage />} />
          {/* 백엔드 연결한후에 로그인한 사용자 정보 가져오면 아래래 라우터 사용 */}
          {/* <Route path="/profile" element={currentUser ? <Navigate to={`/profile/${currentUser.id}`} /> : <Navigate to="/" />} /> */}
        </Routes>

        {/* 공통 하단 네비게이션 */}
        <NavbarBottom />
      </Router>
    </div>
  )
}

export default App
