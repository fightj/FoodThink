import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
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
import ProfilePage from "./pages/ProfilePage"
const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sns" element={<SnsMain />} />
          <Route path="/feed/:id" element={<FeedDetail />} />
          <Route path="/feed/write" element={<FeedWrite />} />
          <Route path="/recipes" element={<RecipesMainPage />} />
          <Route path="/recipes/:id" element={<RecipeDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
        <NavbarBottom />
      </Router>
    </div>
  )
}

export default App
