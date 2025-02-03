import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../../styles/recipe/RecipesMainPage.css" // styles 폴더에서 가져옴
import SearchBar from "../../components/base/SearchBar"

const RecipesMainPage = () => {
  const navigate = useNavigate()
  const [recipes, setRecipes] = useState([])

  const exampleRecipes = [
    {
      id: 1,
      title: "스테이크 덮밥",
      author: "칼잇나",
      image: "https://via.placeholder.com/300?text=Steak+Donburi",
      bookmarks: 27,
    },
    {
      id: 2,
      title: "레시피 제목",
      author: "작성자",
      image: "https://via.placeholder.com/300?text=Recipe+Title",
      bookmarks: 0,
    },
    {
      id: 3,
      title: "레시피 제목",
      author: "작성자",
      image: "https://via.placeholder.com/300?text=Recipe+Title",
      bookmarks: 0,
    },
    {
      id: 4,
      title: "레시피 제목",
      author: "작성자",
      image: "https://via.placeholder.com/300?text=Recipe+Title",
      bookmarks: 0,
    },
  ]

  useEffect(() => {
    setRecipes(exampleRecipes)
  }, []) // 빈 배열로 설정하여 처음 렌더링될 때만 실행

  const handleDetailClick = (id) => {
    navigate(`/recipes/${id}`)
  }

  return (
    <div className="base-div">
      <SearchBar />
      <div className="card-div">
        <div className="recipes-main-page">
          <div className="search-bar">
            <input type="text" placeholder="search text" />
          </div>
          <div className="categories">
            <span>종류별</span>
            <span>재료별</span>
            {/* Add more categories as needed */}
          </div>
          <div className="filters">
            <span>전체</span>
            <span>육류</span>
            <span>채소류</span>
            {/* Add more filters as needed */}
          </div>
          <div className="recipe-count">
            <p>개인 레시피가 있어요</p>
          </div>
          <div className="recipe-grid">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="recipe-card">
                <img src={recipe.image} alt={recipe.title} className="recipe-image" />
                <div className="recipe-info">
                  <h2>{recipe.title}</h2>
                  <p>{recipe.author}</p>
                  <p>북마크 수: {recipe.bookmarks}</p>
                  <button className="detail-button" onClick={() => handleDetailClick(recipe.id)}>
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecipesMainPage
