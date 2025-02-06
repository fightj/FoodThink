import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import SearchBar from "../../components/base/SearchBar"
import Swal from "sweetalert2"
import "../../styles/sns/SnsMain.css"
import PageSlide from "../../components/base/PageSlide"

function SnsMain() {
  const [query, setQuery] = useState("")
  const [feedData, setFeedData] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      // 제공된 데이터셋을 가져오기
      const data = {
        content: [
          {
            id: 2,
            image: "https://foodthinkawsbucket.s3.amazonaws.com/324a9d5e-c192-4f32-8287-51b30cacac25-쿼카.jpg",
            userNickname: "ydbqls13@daum.net",
            userImage: null,
            imageSize: 1,
          },
          {
            id: 1,
            image: "https://foodthinkawsbucket.s3.amazonaws.com/44dd11ab-1558-4101-bdcb-c3303a34b256-쿼카.jpg",
            userNickname: "ydbqls13@daum.net",
            userImage: null,
            imageSize: 2,
          },
        ],
        totalPages: 1,
        totalElements: 2,
        last: true,
      }
      setFeedData(data.content)
    }

    fetchData()
  }, [])

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
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login")
        }
      })
    }
  }

  return (
    <PageSlide>
      <div className="base-div">
        <SearchBar onSearch={handleSearch} />
        <div className="parent-container">
          <div className="card-div">
            <div className="container px-4 py-2" id="custom-cards">
              <div className="d-flex justify-content-between align-items-center mt-0">
                <h2></h2>
                <img src="/images/feed_write_button.png" alt="Feed 작성" style={{ cursor: "pointer", width: "50px", height: "50px" }} onClick={handleWriteClick} />
              </div>

              <div className="row row-cols-1 row-cols-lg-3 align-items-stretch g-4 py-5">
                {feedData.map((feedItem) => {
                  const hasMultipleImages = feedItem.imageSize >= 2

                  return (
                    <div className="col" key={feedItem.id}>
                      <Link to={`/feed/${feedItem.id}`} style={{ textDecoration: "none" }}>
                        <div className="card card-cover h-100 overflow-hidden text-bg-dark rounded-4 shadow-lg feed-card" style={{ backgroundImage: `url(${feedItem.image})` }}>
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
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageSlide>
  )
}

export default SnsMain
