import React, { useState } from "react"
import { Link } from "react-router-dom"
import SearchBar from "../../components/base/SearchBar"
import { Feed, FeedImages, Users } from "./feed_data"  // feed와 feedImages를 import
import "../../styles/sns/SnsMain.css" // 여기에 필요한 스타일 추가
import PageSlide from "../../components/base/PageSlide"
import { useNavigate } from "react-router-dom" // useNavigate로 변경

function SnsMain() {
  const [query, setQuery] = useState("")
  const navigate = useNavigate() // useHistory 대신 useNavigate 사용

  const handleSearch = (query) => {
    setQuery(query)
    if (query.length > 0) {
      navigate(`/search-results?query=${query}`) // 페이지 이동 및 쿼리 전달
    }
  }

  return (
    <PageSlide>
      <div className="base-div">
        <SearchBar onSearch={handleSearch} />
        <div className="card-div">
          <div className="container px-4 py-5" id="custom-cards">
          <div className="d-flex justify-content-between align-items-center pb-2">
            <h2></h2>
            <Link to="/feed/write">
              {/* 이미지로 Feed 작성 버튼 대체, 크기 조정 */}
              <img
                src="/images/feed_write_button.png"
                alt="Feed 작성"
                style={{ cursor: "pointer", width: "50px", height: "50px" }} // 아이콘 크기 조정
              />
            </Link>
          </div>


            <div className="row row-cols-1 row-cols-lg-3 align-items-stretch g-4 py-5">
              {Feed.map((feedItem) => {
                // feedId에 맞는 이미지를 찾음
                const images = FeedImages.filter(image => image.feed_id === feedItem.feed_id);
                const hasMultipleImages = images.length > 1;
                // 해당 feedItem의 작성자 유저 정보 찾기
                const user = Users.find(user => user.user_id === feedItem.user_id); 

                return (
                  <div className="col" key={feedItem.feed_id}>
                    <Link to={`/feed/${feedItem.feed_id}`} style={{ textDecoration: "none" }}>
                      <div
                        className="card card-cover h-100 overflow-hidden text-bg-dark rounded-4 shadow-lg feed-card"
                        style={{
                          backgroundImage: `url(${images.length > 0 ? images[0].image_url : ''})`,  // 첫 번째 이미지 사용
                        }}
                      >
                        {hasMultipleImages && (
                          <div className="image-icon">
                            <img src="/images/pages.png" alt="Multiple images" />
                          </div>
                        )}
                        <div className="d-flex flex-column h-100 p-5 pb-3 text-white text-shadow-1">
                          {/* 유저의 프로필 이미지와 이름 추가 */}
                          <div className="user-info">
                            <img src={user?.image} alt={user?.nickname} className="profile-image-main" />
                            <span>{user?.nickname}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </PageSlide>
  );
}

export default SnsMain;
