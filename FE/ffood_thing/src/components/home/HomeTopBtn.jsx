import React from "react"
import "../../styles/home/HomeTopBtn.css"

function HomeTopBtn() {
  return (
    <div className="home-top-btn">
      <div className="button-container">
        <button className="square-btn">
          <i className="bi bi-bookmark"></i>{" "}
        </button>
        <button className="square-btn">
          <i className="bi bi-person-fill"></i>
        </button>
      </div>
    </div>
  )
}

export default HomeTopBtn
