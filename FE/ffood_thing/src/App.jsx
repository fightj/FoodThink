import React from "react"
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import "bootstrap-icons/font/bootstrap-icons.css"
import "./App.css"

// 공통 스타일
import "./styles/base/global.css"

// 페이지 컴포넌트
import Home from "./pages/home/Home"
import SnsMain from "./pages/sns/SnsMain"
import FeedDetail from "./pages/sns/FeedDetail"
import FeedWrite from "./pages/sns/FeedWrite"
import RecipesMainPage from "./pages/recipe/RecipesMainPage"
import RecipeDetailPage from "./pages/recipe/RecipeDetailPage"
import ProfilePage from "./pages/profile/ProfilePage"
import RecipeWritePage from "./pages/recipe/RecipeWritePage"
import RecipeUpdatePage from "./pages/recipe/RecipeUpdatePage"
import FeedUpdatePage from "./pages/sns/FeedUpdatePage"
import LoginPage from "./pages/login/LoginPage"
import AiRecommendPage from "./pages/recommend/AiRecommendPage"
import TodayRecommendPage from "./pages/recommend/TodayRecommendPage"
import SnsSearchResultPage from "./pages/sns/SnsSearchResultPage" // 검색 결과 페이지 임포트

// 공통 컴포넌트
import NavbarBottom from "./components/base/Navbar-bottom"

// PageSlide 컴포넌트
import PageSlide from "./components/base/PageSlide"

const AnimatedRoutes = () => {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageSlide>
              <Home />
            </PageSlide>
          }
        />

        <Route
          path="/login"
          element={
            <PageSlide>
              <LoginPage />
            </PageSlide>
          }
        />

        <Route
          path="/sns"
          element={
            <PageSlide>
              <SnsMain />
            </PageSlide>
          }
        />
        <Route
          path="/feed/:id"
          element={
            <PageSlide>
              <FeedDetail />
            </PageSlide>
          }
        />
        <Route
          path="/feed/write"
          element={
            <PageSlide>
              <FeedWrite />
            </PageSlide>
          }
        />
        <Route
          path="/feed/:id/update"
          element={
            <PageSlide>
              <FeedUpdatePage />
            </PageSlide>
          }
        />
        <Route
          path="/search-results"
          element={
            <PageSlide>
              <SnsSearchResultPage />
            </PageSlide>
          }
        />

        <Route
          path="/recipes"
          element={
            <PageSlide>
              <RecipesMainPage />
            </PageSlide>
          }
        />
        <Route
          path="/recipes/:id"
          element={
            <PageSlide>
              <RecipeDetailPage />
            </PageSlide>
          }
        />
        <Route
          path="/recipes/write"
          element={
            <PageSlide>
              <RecipeWritePage />
            </PageSlide>
          }
        />
        <Route
          path="/recipes/:id/update"
          element={
            <PageSlide>
              <RecipeUpdatePage />
            </PageSlide>
          }
        />

        <Route
          path="/profile/:id"
          element={
            <PageSlide>
              <ProfilePage />
            </PageSlide>
          }
        />

        <Route
          path="/ai-recommend"
          element={
            <PageSlide>
              <AiRecommendPage />
            </PageSlide>
          }
        />
        <Route
          path="/today-recommend"
          element={
            <PageSlide>
              <TodayRecommendPage />
            </PageSlide>
          }
        />
      </Routes>
    </AnimatePresence>
  )
}

const App = () => {
  return (
    <div>
      <Router>
        <AnimatedRoutes />
        {/* NavbarBottom은 App 최상위에서 고정 위치로 렌더링 */}
        <NavbarBottom />
      </Router>
    </div>
  )
}

export default App
