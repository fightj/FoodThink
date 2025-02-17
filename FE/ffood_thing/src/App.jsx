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
  const [showButton, setShowButton] = useState(true); // 버튼 표시 여부
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

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
    if (!isOpen) setShowButton(false); // 사이드바 열릴 때 버튼 숨김
  };

  const closeSidebar = (e) => {
    if (isOpen && !e.target.closest(".sidebar") && !e.target.closest(".app-toggle-menu")) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeSidebar);
    return () => {
      document.removeEventListener("mousedown", closeSidebar);
    };
  }, [isOpen]);

  // 애니메이션 종료 후 버튼 표시
  const handleTransitionEnd = () => {
    if (!isOpen) {
      setShowButton(true);
    }
  };

  // 터치 시작 지점 기록
  const handleTouchStart = (e) => {
    // touchStartX.current = e.touches[0].clientX; //
    touchStartY.current = e.touches[0].clientY;
  };

  // 터치 이동 거리 측정
  const handleTouchMove = (e) => {
    // touchEndX.current = e.touches[0].clientX; //
    touchStartY.current = e.touches[0].clientY;
  };

   // 터치 종료 시 스와이프 거리 체크
   const handleTouchEnd = () => {
    // const swipeDistance = touchEndX.current - touchStartX.current; //
    // if (swipeDistance > 100) {
    //   // 오른쪽으로 스와이프하면 사이드바 열기
    //   setIsOpen(true);
    //   setShowButton(false);
    // } else if (swipeDistance < -100) {
    //   // 왼쪽으로 스와이프하면 사이드바 닫기
    //   setIsOpen(false);
    // }

    const swipeDistance = touchStartY.current - touchEndY.current;
    if (swipeDistance > 100) {
      setIsOpen(true);
    } else if (swipeDistance < -100) {
      setIsOpen(false);
    }
  };

  const handleMouseDown = (e) => {
    // touchStartX.current = e.clientX; //
    touchStartY.current = e.clientY;
  };
  
  const handleMouseMove = (e) => {
    // touchEndX.current = e.clientX; //
    touchStartY.current = e.clientY;
  };

  const handleMouseUp = () => {
    // const swipeDistance = touchEndX.current - touchStartX.current; //
    const swipeDistance = touchStartY.current - touchEndY.current;
    if (swipeDistance > 100) {
      setIsOpen(true);
      // setShowButton(false); //
    } else if (swipeDistance < -100) {
      setIsOpen(false);
    }
  };
  

  return (
    <>
      <div className="app-container"onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>

      </div>
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} userId={user ? user.userId : null} onTransitionEnd={handleTransitionEnd}/>
      <AnimatedRoutes userInfo={user} />
      {/* <NavbarBottom /> */}
      <button className="app-toggle-menu" onClick={toggleSidebar}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</button>
    </>

    // <div className="app-container" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
    //   {/* 사이드바 */}
    //   <div className={`sidebar ${isOpen ? "open" : ""}`}>
    //     <Sidebar isOpen={isOpen} userId={user ? user.userId : null} />
    //   </div>

    //   {/* 사이드바가 화면 하단에 부분적으로 보이도록 설정 */}
    //   {/* <div className="app-toggle-menu">
    //     <span className="toggle-icon">토글아이콘</span>
    //   </div> */}

    //   {/* Main content */}
    //   <AnimatedRoutes userInfo={user} />
    // </div>
  );
};

// Animated Routes component
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
