import React from "react";

const ProfileHeader = () => {
  const profileImage = `${import.meta.env.BASE_URL}images/profile.jpg`; // ✅ Vite 방식으로 수정

  return (
    <div style={styles.container}>
      <img
        src={profileImage}
        alt="프로필"
        style={styles.avatar}
      />
      <h2 style={styles.username}>
        럭키가이 광전사 <span style={styles.editIcon}>✏️</span>
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
    borderRadius: "50%",
    objectFit: "cover",
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
