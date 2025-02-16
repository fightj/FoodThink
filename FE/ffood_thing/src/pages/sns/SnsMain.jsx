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
    const fetchData = async (page = 0, size = 12) => {
      try {
        const response = await fetch(`https://i12e107.p.ssafy.io/api/feed/read/latest?page=${page}&size=${size}`)
        const data = await response.json()
        setFeedData(data.content)
      } catch (error) {
        console.error("Error fetching feed data:", error)
      }
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
        <div className="card-div">
          {/* <div className="container px-4 px-2" id="custom-cards"> */}
          <div className="d-flex justify-content-between align-items-center mt-0">
            <h2></h2>
            <img src="/images/feed_write_button.png" alt="Feed 작성" className="feed-write-button" onClick={handleWriteClick} />
          </div>

          <div className="row row-cols-1 row-cols-lg-3 align-items-stretch g-4">
            {feedData.map((feedItem) => {
              const hasMultipleImages = feedItem.imageSize >= 2

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
              )
            })}
          </div>
        </div>
      </div>
      {/* </div> */}
    </PageSlide>
  )
}

export default SnsMain
