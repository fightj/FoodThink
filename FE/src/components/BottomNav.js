import React from "react";
import { Link } from "react-router-dom";

const BottomNav = () => {
  return (
    <nav style={styles.navbar}>
      <Link to="/category" style={styles.link}>카테고리</Link>
      <Link to="/" style={styles.link}>홈</Link>
      <Link to="/sns" style={styles.link}>SNS</Link>
      <Link to="/profile" style={styles.link}>마이페이지</Link>
    </nav>
  );
};

const styles = {
  navbar: {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    backgroundColor: "#ffffff",
    display: "flex",
    justifyContent: "space-around",
    padding: "10px 0",
    borderTop: "1px solid #ddd",
    boxShadow: "0 -2px 5px rgba(0, 0, 0, 0.1)",
  },
  link: {
    textDecoration: "none",
    color: "#333",
    fontSize: "16px",
    fontWeight: "bold",
    padding: "10px",
  },
};

export default BottomNav;
