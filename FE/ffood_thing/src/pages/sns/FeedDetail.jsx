import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import FeedCommentSection from "../../components/sns/FeedCommentSection"
import SearchBar from "../../components/base/SearchBar"
import "../../styles/sns/FeedDetail.css"
import { motion, AnimatePresence } from "framer-motion"
import Swal from "sweetalert2"
import RecipeModal from "../../components/sns/RecipeModal" // 모달 컴포넌트 추가

function FeedDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showComments, setShowComments] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [currentFeed, setCurrentFeed] = useState(null)
  const [linkedRecipe, setLinkedRecipe] = useState(null)
  const [sessionUserId, setSessionUserId] = useState(null)
  const [showRecipeModal, setShowRecipeModal] = useState(false) // 모달 상태 추가

  //이미지 여러 장 터치 슬라이드 기능 추가
  const [touchStartX, setTouchStartX] = useState(0); //시작 위치
  const [touchEndX, setTouchEndX] = useState(0); //끝 위치

  const handleTouchStart = (e) => {
    //터치 시작 시, 현재 버튼에 해당하는 영역이 터치된 경우
    const target = e.target;
    if (target.classList.contains('prev-button') || target.classList.contains('next-button')) {
      return; //버튼을 클릭할 경우 터치 이벤트 무시
    }
    setTouchStartX(e.touches[0].clientX); //터치 시작 지점 기록
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.touches[0].clientX); //터치 이동 중 지점 기록
  };

  const handleTouchEnd = () => {
    //터치 이동한 거리 차이로 슬라이드 방향 판단
    if (touchStartX - touchEndX > 50) {
      handleNext(); //다음 이미지로 이동
    }

    if (touchEndX - touchStartX > 50) {
      handlePrev(); //이전 이미지로 이동
    }
  };


  useEffect(() => {
    const fetchFeedData = async () => {
      try {
        const token = localStorage.getItem("accessToken")
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        const response = await fetch(`https://i12e107.p.ssafy.io/api/feed/read/id/${id}`, { headers })
        const data = await response.json()
        setCurrentFeed(data)
        console.log(currentFeed)
        setIsLiked(data.like)
      } catch (error) {
        console.error("Error fetching feed data:", error)
      }
    }

    // Fetch user ID from session storage
    const storedUser = sessionStorage.getItem("user")
    if (storedUser) {
      const user = JSON.parse(storedUser)
      setSessionUserId(user.userId)
    }

    fetchFeedData()
  }, [id])

  if (!currentFeed) {
    return <div>Post not found</div>
  }

  const images = currentFeed.images
  const author = { username: currentFeed.username, image: currentFeed.userImage }
  const likesCount = isLiked ? 1 : 0
  const comments = currentFeed.feedCommentResponseDtos
  const isRecipe = currentFeed.recipeListResponseDto ? true : false

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
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("accessToken")

          const response = await fetch(`https://i12e107.p.ssafy.io/api/feed/delete/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (response.ok) {
            Swal.fire({
              title: "삭제!",
              text: "피드가 삭제되었습니다.",
              icon: "success",
            }).then(() => {
              navigate("/sns") // Redirect to home or another page after deletion
            })
          } else {
            console.error("Error deleting feed")
            Swal.fire({
              title: "Error!",
              text: "피드 삭제 중 오류가 발생했습니다.",
              icon: "error",
            })
          }
        } catch (error) {
          console.error("Error deleting feed:", error)
          Swal.fire({
            title: "Error!",
            text: "피드 삭제 중 오류가 발생했습니다.",
            icon: "error",
          })
        }
      }
    })
  }

  const handleEdit = () => {
    navigate(`/feed/${id}/update`, {
      state: {
        foodName: currentFeed.foodName,
        content: currentFeed.content,
        images: currentFeed.images,
        recipeId: currentFeed.recipeListResponseDto ? currentFeed.recipeListResponseDto.recipeId : null,
        recipeTitle: currentFeed.recipeListResponseDto ? currentFeed.recipeListResponseDto.recipeTitle : null,
      },
    })
  }

  const handleLikeToggle = async () => {
    const token = localStorage.getItem("accessToken")

    if (!token) {
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
      return
    }

    try {
      const url = isLiked ? `https://i12e107.p.ssafy.io/api/feed/like/delete/${id}` : `https://i12e107.p.ssafy.io/api/feed/like/create/${id}`
      const response = await fetch(url, {
        method: isLiked ? "DELETE" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setIsLiked(!isLiked)
      } else {
        console.error(`Error ${isLiked ? "unliking" : "liking"} the feed`)
      }
    } catch (error) {
      console.error(`Error ${isLiked ? "unliking" : "liking"} the feed:`, error)
    }
  }

  const handleAddComment = (newComment) => {
    console.log("New comment added:", newComment)
  }

  return (
    <div className="base-div">
  <SearchBar />
  <div className="card-div">
    {/* 뒤로가기 버튼 */}
    <button onClick={() => navigate(-1)} className="sns-detail-back-button">
      <img src="/images/previous_button.png" alt="Previous" className="icon" />
    </button>

    <div className="sns-detail">
      {/* 사용자 정보 */}
      <div className="user-info-feed">
        <div className="profile-container-feed">
          <div className="profile-image1">
            <img src={author.image || "/images/default_profile.png"} alt={author.username || "User"} className="profile-image1" />
          </div>
          <span className="sns-username">{author.username || "Unknown User"}</span>
        </div>
        {sessionUserId === currentFeed.userId && (
          <div className="edit-container">
            <button className="edit-button1" onClick={toggleDropdown}>
              <img src="/images/etc-btn.png" alt="Edit Options1" />
            </button>
            {showDropdown && (
              <div className="dropdown-menu">
                <button className="dropdown-item" onClick={handleEdit}>feed 수정</button>
                <button className="dropdown-item" onClick={handleDelete}>feed 삭제</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 메인 컨텐츠 (이미지 + 내용) */}
      <div className="main-content">
        {/* 이미지 Carousel */}
        {images.length > 0 && (
          <div className="carousel-container"
                onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
            <div className="carousel">
              {/* {images.length > 1 && (
                <>
                  <button className="prev-button" onClick={handlePrev}>❮</button>
                  <button className="next-button" onClick={handleNext}>❯</button>
                </>
              )} */}
              <img src={images[currentIndex]} alt={`Slide ${currentIndex + 1}`} className="carousel-image" />
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

        {/* 컨텐츠 */}
        <div className="content">
          <span className="likes-comments">
            <img src={isLiked ? "/images/feed_like_do.png" : "/images/feed_like_undo.png"} alt="Like Icon" onClick={handleLikeToggle} style={{ cursor: "pointer" }} />
            <span>{likesCount}</span>

            <button className="comment-button" onClick={toggleComments}>
              <img src="/images/feed_comment.png" alt="Comment Icon" />
            </button>
            <span>{comments.length}</span>
          </span>
          <div className="hash-tag-area">
            <p><strong>#{currentFeed.foodName}</strong></p>
            {isRecipe && <p><strong>#{currentFeed.recipeListResponseDto.recipeTitle}</strong></p>}
          </div>

          <hr />
          <p className="description">
            <strong>{author.username || "Unknown User"}</strong> {currentFeed.content}
          </p>

          {isRecipe && (
            <div className="linked-recipe-area">
              <div className="recipe-image-container">
                <img src="/images/mainlogo.jpg" alt="Main Logo" className="recipe-main-image" />
                <div className="recipe-tooltip" onClick={() => setShowRecipeModal(true)}>
                  <h1>참고한 레시피가 있어요! click!</h1>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>

  <RecipeModal show={showRecipeModal} onHide={() => setShowRecipeModal(false)} recipe={currentFeed.recipeListResponseDto} />

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
        <FeedCommentSection comments={comments} onClose={toggleComments} onAddComment={handleAddComment} feedId={id} />
      </motion.div>
    )}
  </AnimatePresence>
</div>

  )
}

export default FeedDetail
