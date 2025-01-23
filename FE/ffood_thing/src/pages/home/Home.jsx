// components/Home.js
import React from "react"
import HomeCarousel from "../../components/home/HomeCarousel"
import SearchBar from "../../components/base/SearchBar"
import HomeBigButton from "../../components/home/HomeBigButton"
import "../../styles/home/Home.css"
import HomeTopBtn from "../../components/home/HomeTopBtn"

function Home() {
  return (
    <div class="home-div">
      <HomeTopBtn />
      <SearchBar />
      <HomeBigButton />
      {/* <HomeCarousel /> */}
    </div>
  )
}

export default Home
