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
    const urlParams = new URLSearchParams(location.search)
    const token = urlParams.get("accessToken")
    const isNewUser = urlParams.get("isNewUser")

    if (token && !accessToken) {
      console.log("Access Token:", token)
      localStorage.setItem("accessToken", token)
      setAccessToken(token)

      // URL 파라미터를 삭제하여 무한 루프 방지
      navigate("/", { replace: true })
    }

    if (isNewUser) {
      console.log("Is New User:", isNewUser)
    }
  }, [location, navigate, accessToken])

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
