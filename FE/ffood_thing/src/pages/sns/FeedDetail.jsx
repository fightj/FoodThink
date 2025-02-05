import React, { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import FeedCommentSection from "../../components/sns/FeedCommentSection"
import SearchBar from "../../components/base/SearchBar"
import "../../styles/sns/FeedDetail.css"
import { motion, AnimatePresence } from "framer-motion"
import Swal from "sweetalert2"

// 새로운 데이터 정의
const feedData = {
  id: 7,
  foodName: "음식이름7",
  content: "피드내용7",
  writeTime: "2025-01-28T00:47:07.905327",
  userId: 2,
  username: "닉네임2",
  userRecipeId: 417,
  crawlingRecipeId: null,
  images: [
    "https://foodthinkawsbucket.s3.amazonaws.com/3cd0bc20-e8db-47c1-b49a-380ee3ab7825-짜장면.jpeg",
    "https://foodthinkawsbucket.s3.amazonaws.com/db7f95aa-e358-4f8a-bd75-742e5e5695fe-떡볶이.jpeg",
  ],
  feedCommentResponseDtos: [
    {
      id: 2,
      content: "수정된 댓글입니다.",
      username: "닉네임",
      writeTime: "2025-02-02T15:24:36.99946",
    },
    {
      id: 3,
      content: "참 맛있어보여요!",
      username: "닉네임3",
      writeTime: "2025-02-02T15:32:14.684305",
    },
    {
      id: 4,
      content: "추가한 댓글이에요!",
      username: "닉네임",
      writeTime: "2025-02-02T15:32:31.031496",
    },
  ],
  like: false,
}

// 임시 레시피 데이터
const recipes = [
  {
    recipeId: 417,
    recipeTitle: "카라멜을 이용한 쌀강정 만들기~",
    image: "https://recipe1.ezmember.co.kr/cache/recipe/2021/02/14/f7d498c21af6664a0dc6cd39a6ef17871_m.jpg",
    nickname: "파토스",
    userImage: null,
    hits: 294,
    bookMarkCount: 0,
  },
  {
    recipeId: 352,
    recipeTitle: "#술안주_간식 #가래떡간장구이_만들기 #단짠단짠한 간장을 발라서 구워 준 가래떡간장구이",
    image: "https://recipe1.ezmember.co.kr/cache/recipe/2018/02/07/0763cc655016921d1bb5c456de8f322f1_m.jpg",
    nickname: "스폰지밥",
    userImage: null,
    hits: 246,
    bookMarkCount: 0,
  },
]

function FeedDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showComments, setShowComments] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [isLiked, setIsLiked] = useState(feedData.like) // 'like' 상태 추가

  // 현재 피드 데이터
  const currentFeed = feedData // 기존 데이터를 사용하는 대신 새 데이터를 사용
  if (!currentFeed) {
    return <div>Post not found</div>
  }

  // 피드 이미지, 작성자, 좋아요 수, 댓글
  const images = currentFeed.images
  const author = { username: currentFeed.username, image: null } // 사용자 데이터를 직접 설정
  const likesCount = isLiked ? 1 : 0 // 좋아요 수 (임의로 설정)
  const comments = currentFeed.feedCommentResponseDtos

  // 연동된 레시피 데이터 가져오기
  const linkedRecipe = recipes.find((recipe) => recipe.recipeId === currentFeed.userRecipeId)

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const toggleComments = () => {
    setShowComments(!showComments)
  }

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown)
  }

  const handleDelete = () => {
    Swal.fire({
      title: "정말 삭제할까요?",
      text: "되돌릴 수 없어요!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete!",
    }).then((result) => {
      if (result.isConfirmed) {
        // 삭제 로직 추가
        console.log("Feed deleted")
        Swal.fire({
          title: "삭제!",
          text: "피드가 삭제되었습니다.",
          icon: "success",
        })
      }
    })
  }

  const handleEdit = () => {
    navigate(`/feed/${id}/update`)
  }

  const handleLikeToggle = () => {
    setIsLiked(!isLiked) // 'like' 상태 토글
  }

  return (
    <div className="base-div">
      <SearchBar />
      <div className="parent-container">
        <div className="card-div">
          <div style={{ width: "80%", margin: "0 auto" }}>
            <button onClick={() => navigate(-1)} className="back-button">
              <img src="/images/previous_button.png" alt="Previous" className="icon" />
              탐색 탭
            </button>

            <div className="user-info-feed">
              <div className="profile-container-feed">
                <div className="profile-image1">
                  <img src={author.image || "/images/default_profile.png"} alt={author.username || "User"} className="profile-image1" />
                </div>
                <span className="username">{author.username || "Unknown User"}</span>
              </div>
              <div className="edit-container" style={{ position: "relative" }}>
                <button className="edit-button" onClick={toggleDropdown}>
                  <img src="/images/etc-btn.png" alt="Edit Options" />
                </button>
                {showDropdown && (
                  <div className="dropdown-menu">
                    <button className="dropdown-item" onClick={handleEdit}>
                      feed 수정
                    </button>
                    <button className="dropdown-item" onClick={handleDelete}>
                      feed 삭제
                    </button>
                  </div>
                )}
              </div>
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
                  <img src={images[currentIndex]} alt={`Slide ${currentIndex + 1}`} className="carousel-image" />
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
                <img
                  src={isLiked ? "/images/feed_like_do.png" : "/images/feed_like_undo.png"}
                  alt="Like Icon"
                  onClick={handleLikeToggle} // 'like' 상태 토글
                  style={{ cursor: "pointer" }}
                />
                <span>{likesCount}</span>

                {/* 댓글 아이콘 버튼 */}
                <button className="comment-button" onClick={toggleComments}>
                  <img src="/images/feed_comment.png" alt="Comment Icon" />
                </button>
                <span>{comments.length}</span>
              </span>
              <p>
                <strong>#{currentFeed.foodName}</strong>
              </p>
              <hr />
              <p className="description">
                <strong>{author.username || "Unknown User"}</strong> {currentFeed.content}
              </p>
            </div>

            {/* sns관련 연동된 레시피 */}
            {currentFeed.userRecipeId && linkedRecipe ? (
              <div className="linked-recipe-area">
                <h1>참고한 레시피</h1>
                <hr />
                <div style={{ flex: "0 0 60%", position: "relative" }}>
                  <div className="recipe-detail" onClick={() => navigate(`/recipe/${linkedRecipe.recipeId}`)}>
                    <img src={linkedRecipe.image} alt={linkedRecipe.recipeTitle} className="recipe-image" />
                  </div>
                </div>
                <div style={{ flex: "0 0 40%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <p className="recipe-title">{linkedRecipe.recipeTitle}</p>
                </div>
              </div>
            ) : null}
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
              <FeedCommentSection feedId={currentFeed.id} onClose={toggleComments} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default FeedDetail
