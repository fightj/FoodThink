import React from "react";

const ProfileHeader = () => {
  return (
    <div style={styles.container}>
      <img
        src={`${process.env.PUBLIC_URL}/images/profile.jpg`}
        alt="프로필"
        style={styles.avatar}
      />
      <h2 style={styles.username}>
        구이전문 요리사 <span style={styles.editIcon}>✏️</span>
      </h2>
      <div style={styles.info}>
        <span>구독자수: <strong>20</strong></span>
        <span>게시물: <strong>15</strong></span>
      </div>
      <button style={styles.button}>취향</button>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
    background: "linear-gradient(to right, #8360c3, #2ebf91)",
    color: "#fff",
    borderBottomLeftRadius: "20px",
    borderBottomRightRadius: "20px",
  },
  avatar: {
    width: "100px",
    height: "100px",
    aspectRatio: "1 / 1", // ✅ 가로세로 비율 1:1 유지 (원형 보장)
    borderRadius: "50%", // ✅ 원형 적용
    objectFit: "cover", // ✅ 이미지 비율 유지
    display: "block", // ✅ 여백 제거
    margin: "0 auto", // ✅ 가운데 정렬
    border: "3px solid white",
  },
  username: {
    fontSize: "20px",
    margin: "10px 0",
  },
  editIcon: {
    fontSize: "14px",
    cursor: "pointer",
  },
  info: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    fontSize: "14px",
  },
  button: {
    marginTop: "10px",
    background: "#fff",
    color: "#2ebf91",
    border: "none",
    padding: "8px 20px",
    borderRadius: "20px",
    cursor: "pointer",
  },
};

export default ProfileHeader;
