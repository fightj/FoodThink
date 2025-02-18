import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import FeedCommentSection from "../../components/sns/FeedCommentSection"
import "../../styles/sns/FeedDetail.css"
import { motion, AnimatePresence } from "framer-motion"
import Swal from "sweetalert2"
import RecipeModal from "../../components/sns/RecipeModal"
import "../../styles/base/global.css"

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
  const [showRecipeModal, setShowRecipeModal] = useState(false)

  //이미지 및 댓글 모달에 대한 스와이프 기능
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  const [touchEndY, setTouchEndY] = useState(0);
  const [isVerticalSwipe, setIsVerticalSwipe] = useState(false);

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
    setIsVerticalSwipe(false);
  };

  const handleTouchMove = (e) => {
    const deltaX = Math.abs(e.touches[0].clientX - touchStartX);
    const deltaY = Math.abs(e.touches[0].clientY - touchStartY);

    if (deltaY > deltaX) {
      setIsVerticalSwipe(true); //수직 스와이프 감지
    }

    setTouchEndX(e.touches[0].clientX);
    setTouchEndY(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (isVerticalSwipe) {
      //수직 스와이프 감지됨 (위아래)
      if (touchEndY - touchStartY > 50) {
        setShowComments(false); //아래로 스와이프하면 댓글 닫기
      }
    } else {
      //수평 스와이프 (좌우)
      if (touchStartX - touchEndX > 50) {
        handleNext(); //오른쪽으로 스와이프 → 다음 이미지
      } else if (touchEndX - touchStartX > 50) {
        handlePrev(); //왼쪽으로 스와이프 → 이전 이미지
      }
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
      customClass: { popup: "custom-swal-popup"}
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
              customClass: { popup: "custom-swal-popup"}
            }).then(() => {
              navigate("/sns") // Redirect to home or another page after deletion
            })
          } else {
            console.error("Error deleting feed")
            Swal.fire({
              title: "Error!",
              text: "피드 삭제 중 오류가 발생했습니다.",
              icon: "error",
              customClass: { popup: "custom-swal-popup"}
            })
          }
        } catch (error) {
          console.error("Error deleting feed:", error)
          Swal.fire({
            title: "Error!",
            text: "피드 삭제 중 오류가 발생했습니다.",
            icon: "error",
            customClass: { popup: "custom-swal-popup"}
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
        customClass: { popup: "custom-swal-popup"}
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
              <hr />
              <div className="feed-detail-my-text">
                <p className="description">
                  <strong>{author.username || "Unknown User"}</strong> {currentFeed.content}
                </p>
                <p className="hash-tage-recipe-name">#나의_요리는_{currentFeed.foodName.replace(/\s+/g, "_")}</p>
              </div>
              {isRecipe && (
                  <div className="recipe-image-container">
                    <div className="recipe-tooltip" onClick={() => navigate(`/recipes/${currentFeed.recipeListResponseDto.recipeId}`)}>
                      <p>참고 레시피</p>
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
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            >
            <FeedCommentSection comments={comments} onClose={toggleComments} onAddComment={handleAddComment} feedId={id} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FeedDetail
