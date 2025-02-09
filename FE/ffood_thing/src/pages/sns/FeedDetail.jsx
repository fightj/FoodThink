import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FeedCommentSection from "../../components/sns/FeedCommentSection";
import SearchBar from "../../components/base/SearchBar";
import "../../styles/sns/FeedDetail.css";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

function FeedDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [currentFeed, setCurrentFeed] = useState(null);
  const [linkedRecipe, setLinkedRecipe] = useState(null);
  const [sessionUserId, setSessionUserId] = useState(null);

  useEffect(() => {
    const fetchFeedData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await fetch(`https://i12e107.p.ssafy.io/api/feed/read/id/${id}`, { headers });
        const data = await response.json();
        setCurrentFeed(data);
        setIsLiked(data.like);

        if (data.userRecipeId) {
          const recipeResponse = await fetch(`https://i12e107.p.ssafy.io/api/recipe/${data.userRecipeId}`);
          const recipeData = await recipeResponse.json();
          setLinkedRecipe(recipeData);
        }
      } catch (error) {
        console.error("Error fetching feed data:", error);
      }
    };

    // Fetch user ID from session storage
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setSessionUserId(user.userId);
    }

    fetchFeedData();
  }, [id]);

  if (!currentFeed) {
    return <div>Post not found</div>;
  }

  const images = currentFeed.images;
  const author = { username: currentFeed.username, image: currentFeed.userImage };
  const likesCount = isLiked ? 1 : 0;
  const comments = currentFeed.feedCommentResponseDtos;

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

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
          const token = localStorage.getItem("accessToken");

          const response = await fetch(`https://i12e107.p.ssafy.io/api/feed/delete/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            Swal.fire({
              title: "삭제!",
              text: "피드가 삭제되었습니다.",
              icon: "success",
            }).then(() => {
              navigate("/sns"); // Redirect to home or another page after deletion
            });
          } else {
            console.error("Error deleting feed");
            Swal.fire({
              title: "Error!",
              text: "피드 삭제 중 오류가 발생했습니다.",
              icon: "error",
            });
          }
        } catch (error) {
          console.error("Error deleting feed:", error);
          Swal.fire({
            title: "Error!",
            text: "피드 삭제 중 오류가 발생했습니다.",
            icon: "error",
          });
        }
      }
    });
  };

  const handleEdit = () => {
    navigate(`/feed/${id}/update`);
  };

  const handleLikeToggle = async () => {
    const token = localStorage.getItem("accessToken");

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
          navigate("/login");
        }
      });
      return;
    }

    try {
      const url = isLiked ? `https://i12e107.p.ssafy.io/api/feed/like/delete/${id}` : `https://i12e107.p.ssafy.io/api/feed/like/create/${id}`;
      const response = await fetch(url, {
        method: isLiked ? "DELETE" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setIsLiked(!isLiked);
      } else {
        console.error(`Error ${isLiked ? "unliking" : "liking"} the feed`);
      }
    } catch (error) {
      console.error(`Error ${isLiked ? "unliking" : "liking"} the feed:`, error);
    }
  };

  const handleAddComment = (newComment) => {
    // Add the new comment to the local state or send it to the server
    console.log("New comment added:", newComment);
  };

  return (
    <div className="base-div">
      <SearchBar />
      <div className="parent-container">
        <div className="card-div">
          <button onClick={() => navigate(-1)} className="back-button1">
            <img src="/images/previous_button.png" alt="Previous" className="icon" />
            탐색 탭
          </button>
          <div style={{ width: "80%", margin: "0 auto" }}>
            <div className="user-info-feed">
              <div className="profile-container-feed">
                <div className="profile-image1">
                  <img src={author.image || "/images/default_profile.png"} alt={author.username || "User"} className="profile-image1" />
                </div>
                <span className="username">{author.username || "Unknown User"}</span>
              </div>
              {sessionUserId === currentFeed.userId && (
                <div className="edit-container" style={{ position: "relative" }}>
                  <button className="edit-button1" onClick={toggleDropdown}>
                    <img src="/images/etc-btn.png" alt="Edit Options1" />
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
              )}
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
                  onClick={handleLikeToggle}
                  style={{ cursor: "pointer" }}
                />
                <span>{likesCount}</span>

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

            {currentFeed.userRecipeId && linkedRecipe ? (
              <div className="linked-recipe-area" style={{ display: "flex", flexDirection: "column" }}>
                <div className="link-recipe" style={{ marginBottom: "20px" }}>
                  <h1>참고한 레시피</h1>
                  <hr />
                </div>
                <div style={{ display: "flex" }}>
                  <div style={{ flex: "0 0 50%", position: "relative", display: "flex", justifyContent: "center" }}>
                    <div className="recipe-detail" onClick={() => navigate(`/recipe/${linkedRecipe.recipeId}`)}>
                      <img src={linkedRecipe.image} alt={linkedRecipe.recipeTitle} className="recipe-image-sns" />
                    </div>
                  </div>

                  <div style={{ flex: "0 0 50%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div className="recipe-info">
                      <p className="recipe-title1">{linkedRecipe.recipeTitle}</p>
                      <img src={linkedRecipe.userImage || "/images/default_profile.png"} alt="" className="profile-image1" />
                      <span className="username">{linkedRecipe.nickname || "Unknown User"}</span>
                      <p>조회수: {linkedRecipe.hits}</p>
                      <p>북마크: {linkedRecipe.bookMarkCount}</p>
                    </div>
                  </div>
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
              <FeedCommentSection comments={comments} onClose={toggleComments} onAddComment={handleAddComment} feedId={id} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default FeedDetail;
