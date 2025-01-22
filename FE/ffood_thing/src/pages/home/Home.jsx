// components/Home.js
import React from "react"
import HomeCarousel from "../../components/home/HomeCarousel"
import SearchBar from "../../components/base/SearchBar"

function Home() {
  return (
    <div>
      <SearchBar />
      <HomeCarousel />
    </div>
  )
}

export default Home
