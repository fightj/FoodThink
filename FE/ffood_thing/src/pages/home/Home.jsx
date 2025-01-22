// components/Home.js
import React from "react"
import HomeCarousel from "../../components/home/HomeCarousel"
import SearchBar from "../../components/base/SearchBar"
import HomeBigButton from "../../components/home/HomeBigButton"

function Home() {
  return (
    <div>
      <SearchBar />
      <HomeBigButton />
      <HomeCarousel />
      
    </div>
  )
}

export default Home
