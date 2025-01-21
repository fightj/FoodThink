import React from "react";

const BookmarkList = () => {
  const bookmarks = [
    { id: 1, title: "고소한 마늘빵 🥖", image: `${import.meta.env.BASE_URL}images/bookmark1.jpg` },
    { id: 2, title: "치즈 떡볶이 🌶️🧀", image: `${import.meta.env.BASE_URL}images/bookmark2.jpg` },
    { id: 3, title: "홈메이드 수제버거 🍔", image: `${import.meta.env.BASE_URL}images/bookmark3.jpg` },
    { id: 4, title: "초콜릿 브라우니 🍫", image: `${import.meta.env.BASE_URL}images/bookmark4.jpg` },
  ];
  
//commit test
  return (
    <div style={styles.container}>
      <div style={styles.gridContainer}>
        {bookmarks.map((bookmark) => (
          <div key={bookmark.id} style={styles.card}>
            <img src={bookmark.image} alt={bookmark.title} style={styles.image} />
            <p style={styles.title}>{bookmark.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
  },
  gridContainer: {
    display: "flex",
    flexWrap: "wrap", // ✅ 반응형 줄바꿈
    justifyContent: "center", // ✅ 가운데 정렬
    gap: "10px",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "150px", // ✅ 카드 크기 최적화
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: "120px",
    borderRadius: "10px",
    objectFit: "cover",
  },
  title: {
    fontSize: "14px",
    fontWeight: "bold",
    marginTop: "5px",
    whiteSpace: "nowrap", // ✅ 한 줄 유지
    overflow: "hidden", // ✅ 넘칠 경우 숨김
    textOverflow: "ellipsis", // ✅ "..." 처리
    maxWidth: "140px",
  },
};

export default BookmarkList;
