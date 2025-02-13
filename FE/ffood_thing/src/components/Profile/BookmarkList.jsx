import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/profile/RecipeList.css";

const BookmarkList = () => {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        // 1️⃣ 북마크된 레시피 ID 가져오기
        const response = await fetch("https://i12e107.p.ssafy.io/api/bookmark/read/list", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error(`서버 응답 오류: ${response.status}`);

        const bookmarkData = await response.json();
        console.log("📌 북마크된 레시피 ID 목록:", bookmarkData);

        // 2️⃣ 각 레시피의 상세 정보 불러오기
        const recipeDetails = await Promise.all(
          bookmarkData.map(async (bookmark) => {
            const recipeResponse = await fetch(
              `https://i12e107.p.ssafy.io/api/recipes/read/detail/${bookmark.recipeId}`,
              {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            if (!recipeResponse.ok) throw new Error(`레시피 상세 불러오기 오류: ${recipeResponse.status}`);

            return recipeResponse.json();
          })
        );

        console.log("🍽️ 상세한 레시피 데이터:", recipeDetails);
        setBookmarks(recipeDetails);
      } catch (error) {
        console.error("❌ 북마크된 레시피 데이터 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  if (loading) return <div className="recipe-container">⏳ 북마크를 불러오는 중...</div>;
  if (!bookmarks || bookmarks.length === 0) {
    return (
      <div className="recipe-container">
        <div className="no-recipes-wrapper">
          <div className="no-recipes-text">📌 북마크한 레시피가 없습니다. 😯</div>
            <button className="write-recipe-button" onClick={() => navigate("/recipes")}>
              ➕ 북마크하러 가기
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-container">
      <div className="recipe-grid">
        {bookmarks.map((recipe) => (
          <Link
            to={`/recipes/${recipe.recipeId}`} // API 응답 필드에 맞게 수정
            key={recipe.recipeId}
            className="mypage-recipe-card"
            style={{ textDecoration: "none", color: "inherit" }} // 링크 스타일 유지
          >
            <img src={recipe.image} alt={recipe.recipeTitle} className="mypage-recipe-image" />
            <p className="recipe-title1">{recipe.recipeTitle}</p>
            <div className="recipe-meta">
              👁 {recipe.hits} | ⭐ {recipe.bookmarkCount}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BookmarkList;
