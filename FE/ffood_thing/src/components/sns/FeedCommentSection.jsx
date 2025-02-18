import React, { useState, useEffect } from "react";
import "../../styles/sns/FeedCommentSection.css";
import Swal from "sweetalert2";
import "../../styles/base/global.css"

const FeedCommentSection = ({ comments, onClose, onAddComment, feedId }) => {
  const [newComment, setNewComment] = useState("");
  const [localComments, setLocalComments] = useState(comments);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    console.log(storedUser)
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleEditCommentChange = (e) => {
    setEditingCommentContent(e.target.value);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      return;
    }

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
        customClass: { popup: "custom-swal-popup"}
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }

    try {
      const response = await fetch(`https://i12e107.p.ssafy.io/api/feed/comment/create/${feedId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (response.ok) {
        // window.location.reload();
        const newCommentData = await response.text();

        // 댓글 추가 후, 댓글 목록을 다시 fetch
        const updatedCommentsResponse = await fetch(`https://i12e107.p.ssafy.io/api/feed/comment/read/${feedId}`);
        console.log(updatedCommentsResponse)
        if (updatedCommentsResponse.ok) {
          const updatedComments = await updatedCommentsResponse.json();
          setLocalComments(updatedComments);  // 새 댓글 목록으로 갱신
        }

        setNewComment(""); // 댓글 입력란 초기화
        // setLocalComments((prevComments) => [...prevComments, newCommentData]);
        // setNewComment("");
      } else {
        console.error("Error adding comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleEditComment = (commentId, content) => {
    setEditingCommentId(commentId);
    setEditingCommentContent(content);
  };

  const handleUpdateComment = async (commentId) => {
    if (!editingCommentContent.trim()) {
      return;
    }

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
        customClass: { popup: "custom-swal-popup"}
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }

    try {
      const response = await fetch(`https://i12e107.p.ssafy.io/api/feed/comment/update/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: editingCommentContent }),
      });

      if (response.ok) {
        //window.location.reload(); // Automatically refresh the page after updating a comment

        // 서버에서 업데이트된 댓글 목록을 가져오는 대신,
        // 로컬 상태에서 수정된 댓글만 업데이트
        setLocalComments((prevComments) => {
          return prevComments.map((comment) =>
            comment.id === commentId
              ? { ...comment, content: editingCommentContent } // 수정된 댓글만 반영
              : comment
          );
        });

        setEditingCommentId(null);  // 수정 모드 종료
        setEditingCommentContent(""); // 입력란 초기화

      } else {
        console.error("Error updating comment");
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
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
        customClass: { popup: "custom-swal-popup"}
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }

    try {
      const response = await fetch(`https://i12e107.p.ssafy.io/api/feed/comment/delete/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 204) {
        setLocalComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== commentId)
        );
      } else {
        console.error("Error deleting comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="comment-div">
      <div className="comment-input-wrapper">
        <input
          type="text"
          className="comment-input"
          value={newComment}
          onChange={handleCommentChange}
          placeholder="댓글을 입력하세요..."
        />
        <button className="add-comment-button" onClick={handleAddComment}>🚀</button>
      </div>

      {localComments.length > 0 ? (
        localComments.map((comment) => (
          <div key={comment.id} className="comment">
            <img src={comment.userImage || "/images/default_profile.png"} alt={comment.username || "User"} className="profile-image-com" />
            <div className="comment-content-wrapper">
              {editingCommentId === comment.id ? (
                <div>
                  <input
                    className="update-comment-input"
                    type="text"
                    value={editingCommentContent}
                    onChange={handleEditCommentChange}
                  />
                  <button className="update-comment-button" onClick={() => handleUpdateComment(comment.id)}>✏️ 수정 완료</button>
                </div>
              ) : (
                <div>
                  <p className="comment-author-name">{comment.username || "Unknown User"}</p>
                  <p className="comment-content">{comment.content}</p>
                  <span className="comment-time">{comment.writeTime}</span>
                  {currentUser && comment.userId === currentUser.userId && (
                    <div className="comment-actions">
                      <button className="update-comment-button" onClick={() => handleEditComment(comment.id, comment.content)}>✏️ 수정</button>
                      <button className="delete-comment-button" onClick={() => handleDeleteComment(comment.id)}>🗑️ 삭제</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="no-comments">📌 댓글이 없습니다. 😯</p>
      )}
      {/* 닫기 버튼 제거 -> 위에서 아래로 스와이프로 변경 */}
      {/* <img src="/images/exit-btn.png" alt="닫기 버튼" className="close-button-image" onClick={onClose} /> */}
    </div>
  );
};

export default FeedCommentSection;
