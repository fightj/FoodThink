import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/profile/RecipeList.css";

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]); // ✅ API에서 가져온 데이터 저장
  const [loading, setLoading] = useState(true); // ✅ 로딩 상태 추가
  const [error, setError] = useState(null); // ✅ 에러 상태 추가

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const token = localStorage.getItem("accessToken"); // ✅ 로그인 토큰 가져오기
        if (!token) {
          setError("로그인이 필요합니다.");
          setLoading(false);
          return;
        }

        const response = await fetch("https://i12e107.p.ssafy.io/api/myOwnRecipe/read/myRecipeList", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // ✅ 토큰 인증 추가
          },
        });

        if (!response.ok) throw new Error(`서버 응답 오류: ${response.status}`);

        const data = await response.json();
        console.log("📌 불러온 레시피 데이터:", data);
        setRecipes(data); // ✅ 가져온 데이터 저장
      } catch (error) {
        console.error("❌ 레시피 불러오기 실패:", error);
        setError("레시피를 불러오는 중 문제가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  // ✅ 로딩 상태 표시
  if (loading) return <div className="recipe-container">⏳ 레시피를 불러오는 중...</div>;

  // ✅ 에러 메시지 표시
  if (error) return <div className="recipe-container">❌ {error}</div>;

  // ✅ 데이터가 없을 때 처리
  if (!recipes || recipes.length === 0) {
    return <div className="recipe-container">📌 등록된 레시피가 없습니다.</div>;
  }

  return (
    <div className="recipe-container">
      <div className="recipe-grid">
        {recipes.map((recipe) => (
          <Link 
            to={`/recipe/${recipe.recipeId}`} 
            key={recipe.recipeId} 
            className="recipe-card" 
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <img src={recipe.image} alt={recipe.recipeTitle} className="recipe-image" />
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

export default RecipeList;
