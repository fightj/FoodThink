import React, { useState } from "react";
import "../../styles/sns/FeedCommentSection.css";
import { FeedComment, Users } from "../../pages/sns/feed_data";

const FeedCommentSection = ({ feedId, onClose, onAddComment, currentUserId }) => {
  // feedId에 해당하는 댓글 필터링
  const comments = FeedComment.filter((comment) => comment.feed_id === feedId);

  // 댓글 입력을 위한 상태
  const [newComment, setNewComment] = useState("");

  // 댓글 입력 처리 함수
  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  // 댓글 추가 처리 함수
  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment(""); // 댓글 추가 후 입력란 비우기
    }
  };

  // 로그인한 유저의 프로필 이미지 가져오기
  const currentUser = Users.find((user) => user.user_id === currentUserId);
  const profileImage = currentUser?.image || "/images/default_profile.png"; // 기본 이미지

  return (
    <div className="comment-div">
      <h3>댓글</h3>

      {/* 댓글 목록 출력 */}
      {comments.length > 0 ? (
        comments.map((comment) => {
          const user = Users.find((user) => user.user_id === comment.user_id);
          return (
            <div key={comment.comment_id} className="comment">
              <img
                src={user?.image || "/images/default_profile.png"}
                alt={user?.nickname || "User"}
                className="profile-image-com"
              />
              <div className="comment-content-wrapper">
                <span className="comment-author-name">{user?.nickname || "Unknown User"}</span>
                <p className="comment-content">{comment.content}</p>
                <span className="comment-time">{comment.write_time}</span>
              </div>
            </div>
          );
        })
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
        <input
          type="text"
          className="comment-input"
          value={newComment}
          onChange={handleCommentChange}
          placeholder="댓글을 입력하세요..."
        />
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
      <img
        src="/images/exit-btn.png"
        alt="닫기 버튼"
        className="close-button-image"
        onClick={onClose}
      />
    </div>
  );
};

export default FeedCommentSection;
