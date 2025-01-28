import React from "react";
import "../../styles/sns/FeedCommentSection.css";
import { FeedComment, Users } from "../../pages/sns/feed_data"; // 데이터 파일에서 FeedComment와 Users를 import

const FeedCommentSection = ({ feedId, onClose }) => {
  // feedId에 해당하는 댓글 필터링
  const comments = FeedComment.filter((comment) => comment.feed_id === feedId);

  return (
    <div className="comment-div">
      <h3>댓글</h3>
      
      {/* 댓글 목록 출력 */}
      {comments.length > 0 ? (
        comments.map((comment) => {
          const user = Users.find((user) => user.user_id === comment.user_id); // 댓글 작성자의 정보 찾기
          return (
            <div key={comment.comment_id} className="comment">
              <div className="comment-author">
                <img
                  src={user?.image || "/images/default_profile.png"} // 작성자의 프로필 이미지
                  alt={user?.nickname || "User"}
                  className="profile-image"
                />
                <span>{user?.nickname || "Unknown User"}</span>
              </div>
              <p>{comment.content}</p>
              <span className="comment-time">{comment.write_time}</span>
            </div>
          );
        })
      ) : (
        <p>댓글이 없습니다.</p>
      )}

      {/* 닫기 버튼 */}
      <button onClick={onClose}>닫기</button>
    </div>
  );
};

export default FeedCommentSection;
