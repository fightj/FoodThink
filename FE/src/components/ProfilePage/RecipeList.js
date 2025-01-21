import React, { useState, useEffect } from "react";

// ✅ 완전 랜덤한 색상 생성 함수 (책 표지 색상)
const getRandomColor = () => {
  const r = Math.floor(Math.random() * 200); // 0~199 사이 난수
  const g = Math.floor(Math.random() * 200);
  const b = Math.floor(Math.random() * 200);
  return `rgb(${r}, ${g}, ${b})`; // ✅ 완전히 랜덤한 색상 반환
};

// ✅ 색상 대비를 자동으로 조절하는 함수 (배경색에 따라 흰색 or 검은색 선택)
const getContrastColor = (color) => {
  if (!color) return "white"; // ✅ undefined 방지: 기본값 설정
  const rgbMatch = color.match(/\d+/g);
  if (!rgbMatch) return "white"; // ✅ 색상 포맷이 올바르지 않을 경우 기본값 설정

  let [r, g, b] = rgbMatch.map(Number);
  // 밝기 계산 (YIQ 공식을 사용)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 125 ? "black" : "white"; // 밝기에 따라 검은색/흰색 선택
};

const RecipeList = () => {
  const [bookColors, setBookColors] = useState([]);

  useEffect(() => {
    setBookColors(Array.from({ length: recipes.length }, () => getRandomColor()));
  }, []);

  const recipes = [
    { id: 1, title: "울리는 맛있는 라멘 🍜", image: `${process.env.PUBLIC_URL}/images/recipe1.jpg` },
    { id: 2, title: "김치찌개가 힘들게 가르쳐준...", image: `${process.env.PUBLIC_URL}/images/recipe2.jpg` },
    { id: 3, title: "비건짜장면 좋아보이네요...", image: `${process.env.PUBLIC_URL}/images/recipe3.jpg` },
    { id: 4, title: "고기없는 떡볶이 🍢", image: `${process.env.PUBLIC_URL}/images/recipe4.jpg` },
    { id: 5, title: "해장용 순두부찌개 🍲", image: `${process.env.PUBLIC_URL}/images/recipe5.jpg` },
    { id: 6, title: "스테이크 샐러드 🥗", image: `${process.env.PUBLIC_URL}/images/recipe6.jpg` },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.shelfContainer}>
        <div style={styles.grid}>
          {recipes.map((recipe, index) => {
            const coverColor = bookColors[index] || "rgb(100, 100, 100)"; // ✅ undefined 방지: 기본 색상 설정
            const spineColor = coverColor.replace("rgb", "rgba").replace(")", ", 0.7)"); // ✅ 책등 색상 조정
            const textColor = getContrastColor(coverColor); // ✅ 대비되는 텍스트 색상 선택

            return (
              <div key={recipe.id} style={styles.bookContainer}>
                {/* 📚 책등(Spine) */}
                <div style={{ ...styles.spine, backgroundColor: spineColor }}></div>

                {/* 📕 책 표지 */}
                <div style={{ ...styles.bookCover, backgroundColor: coverColor }}>
                  <img src={recipe.image} alt={recipe.title} style={styles.image} />
                  <p style={{ ...styles.title, color: textColor }} title={recipe.title}>
                    {recipe.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#f3e5ab",
  },
  shelfContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "30px",
    width: "90%",
    maxWidth: "1000px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
    gap: "45px",
    width: "100%",
  },
  bookContainer: {
    display: "flex",
    alignItems: "center",
    position: "relative",
    width: "100%",
    maxWidth: "160px",
    height: "220px", // ✅ 책 표지 높이
  },
  spine: {
    width: "10px", // ✅ 책등 너비
    height: "calc(100% + 20px)", // ✅ 책 표지의 padding(10px * 2)을 반영하여 조정
    borderTopLeftRadius: "5px",
    borderBottomLeftRadius: "5px",
    position: "absolute",
    left: "0",
  },
  bookCover: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: "100%",
    padding: "10px", // ✅ 내부 콘텐츠 여백 (이로 인해 높이가 커졌음)
    borderRadius: "5px",
    boxShadow: "3px 6px 8px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
    border: "2px solid rgba(0, 0, 0, 0.1)",
    position: "relative",
    marginLeft: "10px", // ✅ 책등과 간격 확보
  },
  title: {
    fontSize: "14px",
    fontWeight: "bold",
    padding: "10px",
    textAlign: "center",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "100%",
    borderTopLeftRadius: "5px",
    borderTopRightRadius: "5px",
  },
  image: {
    width: "100%",
    height: "150px",
    borderRadius: "5px",
    objectFit: "cover",
  },
};

export default RecipeList;
