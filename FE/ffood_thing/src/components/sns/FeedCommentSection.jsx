import React, { useState } from "react"
import "../../styles/sns/FeedCommentSection.css"

// 주어진 데이터를 사용하여 댓글 섹션 구성
const feedData = {
  id: 7,
  foodName: "음식이름7",
  content: "피드내용7",
  writeTime: "2025-01-28T00:47:07.905327",
  userId: 2,
  username: "닉네임2",
  userRecipeId: 1,
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

const FeedCommentSection = ({ feedId, onClose, onAddComment, currentUserId }) => {
  // feedId에 해당하는 댓글 필터링
  const comments = feedData.feedCommentResponseDtos

  // 댓글 입력을 위한 상태
  const [newComment, setNewComment] = useState("")

  // 댓글 입력 처리 함수
  const handleCommentChange = (e) => {
    setNewComment(e.target.value)
  }

  // 댓글 추가 처리 함수
  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment)
      setNewComment("") // 댓글 추가 후 입력란 비우기
    }
  }

  // 로그인한 유저의 프로필 이미지 가져오기
  const currentUser = { user_id: currentUserId, image: null, nickname: "Current User" } // 임시 데이터
  const profileImage = currentUser.image || "/images/default_profile.png" // 기본 이미지

  return (
    <div className="comment-div">
      <h3>댓글</h3>

      {/* 댓글 목록 출력 */}
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id} className="comment">
            <img src="/images/default_profile.png" alt={comment.username || "User"} className="profile-image-com" />
            <div className="comment-content-wrapper">
              <span className="comment-author-name">{comment.username || "Unknown User"}</span>
              <p className="comment-content">{comment.content}</p>
              <span className="comment-time">{comment.writeTime}</span>
            </div>
          </div>
        ))
      ) : (
        <p className="no-comments">댓글이 없습니다.</p>
      )}

      {/* 댓글 작성 폼 */}
      <div className="comment-input-wrapper">
        {/* 프로필 이미지 추가 */}
        <img
          src={profileImage}
          alt="프로필 이미지"
          className="profile-image-com" // 스타일을 동일하게 적용
        />
        <input type="text" className="comment-input" value={newComment} onChange={handleCommentChange} placeholder="댓글을 입력하세요..." />
        <div className="btn-background">
          <img
            src="/images/up-arrow.png" // 원하는 이미지 경로
            alt="댓글 추가"
            className="add-comment-btn-image"
            onClick={handleAddComment}
          />
        </div>
      </div>

      {/* 닫기 버튼 */}
      <img src="/images/exit-btn.png" alt="닫기 버튼" className="close-button-image" onClick={onClose} />
    </div>
  )
}

export default FeedCommentSection
