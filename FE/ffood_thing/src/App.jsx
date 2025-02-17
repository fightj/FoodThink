import React, { useEffect, useState, useContext, useRef } from "react"
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import axios from "axios"
import "bootstrap-icons/font/bootstrap-icons.css"
import "bootstrap/dist/css/bootstrap.min.css" //bootstrap
import "bootstrap/dist/js/bootstrap.bundle.min.js" //bootstrap dropdown
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
import DemoCookingPage from "./pages/recipe/DemoCookingPage"

import NavbarBottom from "./components/base/Navbar-bottom"
import PageSlide from "./components/base/PageSlide"
import Sidebar from "./components/base/Sidebar"
import { UserProvider, UserContext } from "./contexts/UserContext" // 올바르게 import

import KakaoCallback from "./pages/login/KakaoCallback"

import ToggleButton from "./components/base/ToggleButton"

// Function to fetch user info
// const fetchUserInfo = async () => {
//   try {
//     const accessToken = localStorage.getItem("accessToken")
//     if (!accessToken) throw new Error("엑세스 토큰이 없습니다.")

//     const response = await axios.get("https://i12e107.p.ssafy.io/api/users/read/my-info", {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     })

//     console.log("User Info:", response.data)

//     return response.data
//   } catch (error) {
//     console.error("Error fetching user info:", error.response?.data || error.message)
//     throw error
//   }
// }

// Function to parse URL parameters
const getUrlParameter = (name) => {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(name)
}

// Main App component
const App = () => {
  return (
    <UserProvider>
      <Router>
        <MainApp />
      </Router>
    </UserProvider>
  )
}
const MainApp = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, setUser } = useContext(UserContext)
  const [tokenLoaded, setTokenLoaded] = useState(false) // UserContext를 올바르게 사용

  // useEffect(() => {
  //   const initializeApp = async () => {
  //     try {
  //       // Parse accessToken from URL parameters

  //       const accessToken = localStorage.getItem("accessToken");

  //       // if (accessToken) {
  //       //   console.log("Access Token:", accessToken); // 콘솔에 accessToken 출력
  //       //   localStorage.setItem("accessToken", accessToken)
  //       //   setTokenLoaded(true);
  //       // }

  //       // Initialize userInfo and fetch user details
  //       if (accessToken) {
  //         try {

  //           //const userInfo = await fetchUserInfo();
  //           //setUser(userInfo);
  //           //sessionStorage.setItem("user", JSON.stringify(userInfo));
  //           //console.log("Initial User Info:", userInfo);
  //         } catch (error) {
  //           console.error("Failed to fetch user info:", error);
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Failed to load access token:", error);
  //     }
  //   };

  //   initializeApp();
  // }, [setUser]);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  const closeSidebar = (e) => {
    // console.log("Clicked element:", e.target);
    if (isOpen && !e.target.closest(".sidebar-container") && !e.target.closest(".toggle-button")) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", closeSidebar);
    return () => {
      document.removeEventListener("click", closeSidebar);
    };
  }, [isOpen]);
  

  return (
    <>
      {/* 사이드바를 토글 버튼으로 변경 */}
      <ToggleButton toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} userId={user ? user.userId : null}/>
      <AnimatedRoutes userInfo={user} />
    </>
  );
};


const AnimatedRoutes = ({ userInfo }) => {
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
          path="/oauth/callback/kakao"
          element={
            <PageSlide>
              <KakaoCallback />
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
              <FeedWrite userInfo={userInfo} />
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
          path="/recipes/:id/cooking"
          element={
            <PageSlide>
              <DemoCookingPage />
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
          path="/recipes/update/:id"
          element={
            <PageSlide>
              <RecipeUpdatePage />
            </PageSlide>
          }
        />
        <Route
          path="/profile/:nickname"
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

export default App
