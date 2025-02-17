import React, { useState, useEffect, useRef, useCallback  } from "react"
import { Link, useNavigate } from "react-router-dom"
import SearchBar from "../../components/base/SearchBar"
import Swal from "sweetalert2"
import "../../styles/sns/SnsMain.css"
import PageSlide from "../../components/base/PageSlide"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronUp } from "@fortawesome/free-solid-svg-icons"

function SnsMain() {
  const [query, setQuery] = useState("")
  const [feedData, setFeedData] = useState([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isFetching, setIsFetching] = useState(false)
  const observer = useRef()
  const navigate = useNavigate()

  const fetchData = async (pageNum) => {
      if (isFetching) return; // 중복 요청 방지
      setIsFetching(true);
      try {
        const response = await fetch(
          `https://i12e107.p.ssafy.io/api/feed/read/latest?page=${pageNum}&size=12`
        );
        const data = await response.json();
        if (data.content.length === 0) {
          setHasMore(false); // 더 이상 불러올 데이터 없음
        } else {
          setFeedData((prev) => [...prev, ...data.content]);
        }
      } catch (error) {
        console.error("Error fetching feed data:", error);
      }
      setIsFetching(false);
    };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSearch = (query) => {
    setQuery(query)
    if (query.length > 0) {
      navigate(`/search-results?query=${query}`)
    }
  }

  const handleWriteClick = () => {
    const accessToken = localStorage.getItem("accessToken")
    if (accessToken) {
      navigate("/feed/write")
    } else {
      Swal.fire({
        title: "로그인이 필요합니다",
        text: "로그인 페이지로 이동하시겠습니까?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "네, 이동합니다",
        cancelButtonText: "취소",
        customClass: {
          popup: "custom-swal-popup", // 공통 CSS 클래스 적용
        },
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login")
        }
      })
    }
  }

  const lastFeedElementRef = useCallback(
    (node) => {
      if (isFetching) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetching, hasMore]
  );

  // 페이지 맨 위로 스크롤하는 함수
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth"})
  }

  return (
    <PageSlide>
      <div className="base-div">
        <SearchBar onSearch={handleSearch} />
        <div className="card-div">
          <div className="d-flex justify-content-between align-items-center mt-0">
            <h2></h2>
            <img src="/images/feed_write_button.png" alt="Feed 작성" className="feed-write-button" onClick={handleWriteClick} />
          </div>
          {/* row-cols-1  */}
          <div className="row row-cols-lg-3 align-items-stretch g-2">
            {feedData.map((feedItem, index) => {
              const hasMultipleImages = feedItem.imageSize >= 2
            if (index === feedData.length - 1) {
              return (
                // col
                <div className="col-4" key={feedItem.id} ref={lastFeedElementRef}>
                  <Link to={`/feed/${feedItem.id}`} style={{ textDecoration: "none" }}>
                    <div className="card card-cover h-100 overflow-hidden rounded-4 feed-card" style={{ backgroundImage: `url(${feedItem.image})` }}>
                      {hasMultipleImages && (
                        <div className="image-icon">
                          <img src="/images/pages.png" alt="Multiple images" />
                        </div>
                      )}
                      <div className="d-flex flex-column h-100 p-5 pb-3 text-white text-shadow-1">
                        <div className="user-info">
                          <img src={feedItem.userImage || "/images/default_profile.png"} alt={feedItem.userNickname} className="profile-image-main" />
                          <span>{feedItem.userNickname}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )
            } else {
                return (
                  <div className="col" key={feedItem.id}>
                    <Link to={`/feed/${feedItem.id}`} style={{ textDecoration: "none" }}>
                      <div className="card card-cover h-100 overflow-hidden rounded-4 feed-card" style={{ backgroundImage: `url(${feedItem.image})` }}>
                        {hasMultipleImages && (
                          <div className="image-icon">
                            <img src="/images/pages.png" alt="Multiple images" />
                          </div>
                        )}
                        <div className="d-flex flex-column h-100 p-5 pb-3 text-white text-shadow-1">
                          <div className="user-info">
                              <img src={feedItem.userImage || "/images/default_profile.png"} alt={feedItem.userNickname} className="profile-image-main" />
                            <span>{feedItem.userNickname}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              }
            })}
          </div>
        </div>
        {/* 페이지 맨 위로 올라가는 버튼 */}
        <div className="sns-main-scroll-to-top-div" onClick={scrollToTop}>
          <FontAwesomeIcon icon={faChevronUp} size="lg" />
          <span className="sns-main-top-text">TOP</span>
        </div>
      </div>
    </PageSlide>
  )
}

export default SnsMain
