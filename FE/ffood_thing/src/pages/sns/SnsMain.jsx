import React from "react"
import { Link } from "react-router-dom"
import SearchBar from "./SearchBar"
import feed_posts from "./feed_data"
import "./SnsMain.css" // 여기에 필요한 스타일 추가

function SnsMain() {
  return (
    <div>
      <SearchBar />
      <hr />
      <div className="container px-4 py-5" id="custom-cards">
        <div className="d-flex justify-content-between align-items-center pb-2 border-bottom">
          <h2 className="m-0">FoodThink's SNS</h2>
          <Link to="/feed/write">
            <button className="btn btn-primary">Feed 작성</button>
          </Link>
        </div>
        <div className="row row-cols-1 row-cols-lg-3 align-items-stretch g-4 py-5">
          {feed_posts.map((post) => (
            <div className="col" key={post.id}>
              <Link to={`/feed/${post.id}`} style={{ textDecoration: "none" }}>
                <div
                  className="card card-cover h-100 overflow-hidden text-bg-dark rounded-4 shadow-lg feed-card"
                  style={{
                    backgroundImage: `url(${post.image})`,
                  }}
                >
                  <div className="d-flex flex-column h-100 p-5 pb-3 text-white text-shadow-1">{/* 콘텐츠 추가 가능 */}</div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SnsMain
