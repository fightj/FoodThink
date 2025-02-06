import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import SearchBar from "../../components/base/SearchBar"
import HomeBigButton from "../../components/home/HomeBigButton"
import "../../styles/home/Home.css"
import PageSlide from "../../components/base/PageSlide"

function Home() {
  const [accessToken, setAccessToken] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    // URLSearchParams를 이용하여 URL의 쿼리 파라미터를 가져옴
    const searchParams = new URLSearchParams(location.search)
    const urlAccessToken = searchParams.get("accessToken")
    console.log(urlAccessToken)
    if (urlAccessToken) {
      const storedAccessToken = localStorage.getItem("accessToken")

      if (storedAccessToken !== urlAccessToken) {
        // 액세스 토큰을 콘솔에 출력
        console.log("New access token from URL:", urlAccessToken)

        // 액세스 토큰을 로컬 스토리지에 저장
        localStorage.setItem("accessToken", urlAccessToken)

        // 로그인 성공 메시지 출력
        console.log("로그인 성공")

        // 상태 업데이트
        setAccessToken(urlAccessToken)
      } else {
        console.log("Access token matches the stored token.")
        setAccessToken(storedAccessToken)
      }

      // URL에서 accessToken 제거 (UX를 위해)
      navigate("/", { replace: true })
    } else {
      // 로컬 스토리지에 저장된 액세스 토큰을 가져옴
      const storedAccessToken = localStorage.getItem("accessToken")
      if (storedAccessToken) {
        console.log("현재 로그인한 유저:", storedAccessToken)
        setAccessToken(storedAccessToken)
      } else {
        console.log("Access token is not present")
        // navigate("/login") // 로그인 페이지로 이동
      }
    }
  }, [location, navigate])

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
