import React, { useEffect, useState } from "react"
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import axios from "axios"
import "bootstrap-icons/font/bootstrap-icons.css"
import "bootstrap/dist/css/bootstrap.min.css"; //bootstrap
import "bootstrap/dist/js/bootstrap.bundle.min.js";  //bootstrap dropdown
import "./App.css"
import "./styles/base/global.css"

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
import SnsSearchResultPage from "./pages/sns/SnsSearchResultPage"
import RecipeSearchResultPage from "./pages/recipe/RecipeSearchResultPage"

import NavbarBottom from "./components/base/Navbar-bottom"
import PageSlide from "./components/base/PageSlide"
import Sidebar from "./components/base/Sidebar"
import { UserProvider } from "./contexts/UserContext"

const fetchUserInfo = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken")
    if (!accessToken) throw new Error("Access token is missing")

    const response = await axios.get("https://i12e107.p.ssafy.io/api/users/read", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    console.log("User Info:", response.data)
    return response.data
  } catch (error) {
    console.error("Error fetching user info:", error.response?.data || error.message)
    throw error
  }
}

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
          path="/search"
          element={
            <PageSlide>
              <RecipeSearchResultPage />
            </PageSlide>
          }
        />
      </Routes>
    </AnimatePresence>
  )
}

const App = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const userInfo = await fetchUserInfo()
        setUser(userInfo)
        sessionStorage.setItem("user", JSON.stringify(userInfo))
      } catch (error) {
        console.error("Failed to fetch user info:", error)
      }
    }

    getUserInfo()
  }, [])

  const toggleSidebar = () => setIsOpen(!isOpen)

  return (
    <UserProvider>
      <Router>
        <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} userId={user ? user.userId : null} />
        <AnimatedRoutes />
        <NavbarBottom />
      </Router>
    </UserProvider>
  )
}

export default App
