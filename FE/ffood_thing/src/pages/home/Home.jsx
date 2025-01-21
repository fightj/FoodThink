// components/Home.js
import React from "react"
import HomeCarousel from "../HomeCarousel"
import SearchBar from "../SearchBar"

function Home() {
  return (
    <div>
      <SearchBar />
      <HomeCarousel />
    </div>
  )
}

export default Home
