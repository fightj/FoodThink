import React, { useEffect, useState, useContext } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import SearchBar from "../../components/base/SearchBar"
import HomeBigButton from "../../components/home/HomeBigButton"
import "../../styles/home/Home.css"
import PageSlide from "../../components/base/PageSlide"
import { UserContext } from "../../contexts/UserContext"

function Home() {
  const [accessToken, setAccessToken] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useContext(UserContext) // useContext를 사용하여 UserContext에서 user를 가져옴

  useEffect(() => {
    if (user) {
      console.log("Current User Info in Home:", user) // 콘솔에 사용자 정보 출력
      
    }

  //   const urlParams = new URLSearchParams(location.search)
  //   const token = urlParams.get("accessToken")
  //   const isNewUser = urlParams.get("isNewUser")

  //   if (token && !accessToken) {
  //     console.log("Access Token:", token)
  //     localStorage.setItem("accessToken", token)
  //     setAccessToken(token)

  //     // URL 파라미터를 삭제하여 무한 루프 방지
  //     navigate("/", { replace: true })
  //   }

  //   if (isNewUser) {
  //     console.log("Is New User:", isNewUser)
  //   }
  // }, [location, navigate, accessToken, user])

  const token = localStorage.getItem("accessToken");
    if (token && !accessToken) {
      setAccessToken(token);
      console.log("Access Token:", token);

      // 사용자 정보를 로드하거나 다른 작업 수행
      navigate("/", { replace: true });
    }
  }, [navigate, accessToken, user]);
  
  return (
    <PageSlide>
      <div className="base-div">
        <SearchBar />
        <HomeBigButton />
      </div>
    </PageSlide>
  )
}

export default Home
