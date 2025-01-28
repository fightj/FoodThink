import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Feed, FeedImages, Users } from "./feed_data"; // feed와 feedImages를 import
import PageSlide from "../../components/base/PageSlide";
import SearchBar from "../../components/base/SearchBar"; // SearchBar 컴포넌트 불러오기
import "../../styles/sns/SnsMain.css"; // 스타일 추가

function SnsSearchResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get("query") || "";

  const [query, setQuery] = useState(initialQuery);

  const filteredFeeds = Feed.filter(feed => feed.food_name.includes(query));

  const handleSearch = (newQuery) => {
    setQuery(newQuery);
    navigate(`/search-results?query=${newQuery}`); // 쿼리 변경 시 URL 업데이트
  };

  useEffect(() => {
    setQuery(initialQuery); // URL 변경 시 쿼리 상태 업데이트
  }, [initialQuery]);

  return (
    <PageSlide>
      <div className="base-div">
        {/* SearchBar 컴포넌트를 호출, onSearch와 초기 query 전달 */}
        <SearchBar onSearch={handleSearch} initialQuery={query} />
        <div className="card-div">
          <div className="container px-4 py-5" id="custom-cards">
            <div className="d-flex justify-content-between align-items-center pb-2">
              {/* 이전 버튼 클릭 시, 이전 페이지로 이동 */}
              <button onClick={() => navigate(-1)} className="back-button">
                <img src="/images/previous_button.png" alt="Previous" className="icon" />
                이전
              </button>
              {/* 검색 결과 텍스트는 화면 중앙 정렬 */}
              <h2 className="search-result-title">검색 결과: "{query}"</h2>
            </div>

            <div className="row row-cols-1 row-cols-lg-3 align-items-stretch g-4 py-5">
              {filteredFeeds.length > 0 ? (
                filteredFeeds.map((feedItem) => {
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
                              <img src={user?.image} alt={user?.nickname} className="profile-image" />
                              <span>{user?.nickname}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })
              ) : (
                <p>검색 결과가 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageSlide>
  );
}

export default SnsSearchResultPage;
