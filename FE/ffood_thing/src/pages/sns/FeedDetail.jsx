import React, { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Feed, FeedImages, Users, FeedLike, FeedComment } from "./feed_data"
import FeedCommentSection from "../../components/sns/FeedCommentSection"
import SearchBar from "../../components/base/SearchBar"
import "../../styles/sns/FeedDetail.css"
import { motion, AnimatePresence } from "framer-motion"

function FeedDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showComments, setShowComments] = useState(false)

  // 현재 피드 데이터
  const currentFeed = Feed.find((item) => item.feed_id === parseInt(id))
  if (!currentFeed) {
    return <div>Post not found</div>
  }

  // 피드 이미지, 작성자, 좋아요 수, 댓글
  const images = FeedImages.filter((image) => image.feed_id === currentFeed.feed_id)
  const author = Users.find((user) => user.user_id === currentFeed.user_id)
  const likesCount = FeedLike.filter((like) => like.feed_id === currentFeed.feed_id).length
  const comments = FeedComment.filter((comment) => comment.feed_id === currentFeed.feed_id)

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const toggleComments = () => {
    setShowComments(!showComments)
  }

  return (
    <div className="base-div">
      <SearchBar />
      <div className="card-div">
        <div style={{ width: "80%", margin: "0 auto" }}>
          <button onClick={() => navigate(-1)} className="back-button">
            <img src="/images/previous_button.png" alt="Previous" className="icon" />
            탐색 탭
          </button>

          <div className="user-info-feed">
            <div className="profile-container-feed">
              <div className="profile-image">
                <img src={author?.image || "/images/default_profile.png"} alt={author?.nickname || "User"} className="profile-image" />
              </div>
              <span className="username">{author?.nickname || "Unknown User"}</span>
            </div>
            <button className="edit-button">✎</button>
          </div>

          {/* 이미지 Carousel */}
          {images.length > 0 && (
            <div className="carousel-container">
              <div className="carousel">
                {images.length > 1 && (
                  <>
                    <button className="prev-button" onClick={handlePrev}>
                      ❮
                    </button>
                    <button className="next-button" onClick={handleNext}>
                      ❯
                    </button>
                  </>
                )}
                <img src={images[currentIndex]?.image_url} alt={`Slide ${currentIndex + 1}`} className="carousel-image" />
                {/* 이미지 번호 표시 */}
                <span className="image-counter">
                  {currentIndex + 1} / {images.length}
                </span>
              </div>
              {images.length > 1 && (
                <div className="indicator-container">
                  {images.map((_, index) => (
                    <span key={index} className={`indicator-dot ${currentIndex === index ? "active" : ""}`} />
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="content">
            <span className="likes-comments">
              <img src="/images/feed_like_do.png" alt="Like Icon" />
              <span>{likesCount}</span>

              {/* 댓글 아이콘 버튼 */}
              <button className="comment-button" onClick={toggleComments}>
                <img src="/images/feed_comment.png" alt="Comment Icon" />
              </button>
              <span>{comments.length}</span>
            </span>
            <p>
              <strong>#{currentFeed.food_name}</strong>
            </p>
            <hr />
            <p className="description">
              <strong>{author?.nickname || "Unknown User"}</strong> {currentFeed.content}
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{
              y: { type: "spring", stiffness: 300, damping: 30, duration: 1 },
              opacity: { duration: 1 },
            }}
            className="comment-slide"
          >
            <FeedCommentSection feedId={currentFeed.feed_id} onClose={toggleComments} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FeedDetail
