// components/Home.js
import React from "react"
import SearchBar from "../../components/base/SearchBar"
import HomeBigButton from "../../components/home/HomeBigButton"
import "../../styles/home/Home.css"

function Home() {
  return (
    <div class="base-div">
      <SearchBar />
      <HomeBigButton />
    </div>
  )
}

export default Home
