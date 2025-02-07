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
