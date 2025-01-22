import React from "react"
import { useParams, useNavigate } from "react-router-dom"
import feed_posts from "./feed_data"
import BackTab from "../../components/base/BackTab"

function FeedDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const post = feed_posts.find((item) => item.id === parseInt(id))

  if (!post) {
    return <div>Post not found</div>
  }

  return (
    <div>
      {/* 상단 바 */}
      <BackTab title="탐색 탭" />

      <div style={{ width: "80%", margin: "0 auto" }}>
        {/* 여기에 내용 추가 */}
        {/* 사용자 정보 */}
        <div style={styles.userInfo}>
          <div style={styles.profileContainer}>
            <div style={styles.profileImage}></div>
            <span style={styles.username}>{post.username || "SSAFY_KIM"}</span>
          </div>
          <button style={styles.editButton}>✎</button> {/*현재 로그인한 유저라면 이 버튼을 활성화해서 수정하기로 이동. */}
        </div>

        {/* 이미지 섹션 */}
        <div style={styles.imageContainer}>
          <img src={post.image} alt={post.title} style={styles.image} />
          <span style={styles.imageIndicator}>1/4</span>
        </div>

        {/* 내용 섹션 */}
        <div style={styles.content}>
          <span style={styles.likesComments}>
            ♥ {post.likes || "1,256"} · 💬 {post.comments?.length || "5"}
          </span>
          <p style={styles.description}>
            <strong>{post.username || "SSAFY_KIM"}</strong> {post.content}
          </p>

          {/* 댓글 섹션 */}
          <div style={styles.commentSection}>
            {post.comments?.map((comment, index) => (
              <div key={index} style={styles.comment}>
                <span style={styles.commentAuthor}>{comment.author}</span>
                <span style={styles.commentText}>{comment.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    backgroundColor: "#fbeae9", // 연한 핑크색 배경
    padding: "10px",
    fontFamily: "'Arial', sans-serif",
  },
  navBar: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    backgroundColor: "#fff",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    marginBottom: "10px",
  },
  backButton: {
    fontSize: "1.5rem",
    border: "none",
    background: "none",
    cursor: "pointer",
    marginRight: "10px",
  },
  navTitle: {
    fontSize: "1.2rem",
    fontWeight: "bold",
  },
  userInfo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
  },
  profileContainer: {
    display: "flex",
    alignItems: "center",
  },
  profileImage: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#ccc",
    marginRight: "10px",
  },
  username: {
    fontSize: "1rem",
    fontWeight: "bold",
  },
  editButton: {
    fontSize: "1.2rem",
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  imageContainer: {
    position: "relative",
    textAlign: "center",
    marginBottom: "20px",
  },
  image: {
    width: "100%",
    maxHeight: "500px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  imageIndicator: {
    position: "absolute",
    bottom: "10px",
    right: "10px",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "#fff",
    padding: "5px 10px",
    borderRadius: "10px",
    fontSize: "0.8rem",
  },
  content: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  },
  likesComments: {
    fontSize: "0.9rem",
    marginBottom: "10px",
    color: "#888",
  },
  description: {
    fontSize: "1rem",
    marginBottom: "20px",
  },
  commentSection: {
    borderTop: "1px solid #ddd",
    paddingTop: "10px",
  },
  comment: {
    display: "flex",
    justifyContent: "space-between",
    padding: "5px 0",
  },
  commentAuthor: {
    fontWeight: "bold",
  },
  commentText: {
    marginLeft: "10px",
  },
}

export default FeedDetail
