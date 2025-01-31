import React from "react"
import SearchBar from "../../components/base/SearchBar"
import HomeBigButton from "../../components/home/HomeBigButton"
import "../../styles/home/Home.css"
import PageSlide from "../../components/base/PageSlide"

function Home() {
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
