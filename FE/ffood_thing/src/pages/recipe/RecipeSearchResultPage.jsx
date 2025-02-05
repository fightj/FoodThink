import React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { recipes as exampleRecipes } from "./recipe_data" // 레시피 데이터 가져오기
import SearchBarRecipe from "../../components/base/SearchBarRecipe"
import "../../styles/recipe/RecipesMainPage.css"

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

const RecipeSearchResultPage = () => {
  const query = useQuery().get("query")
  const navigate = useNavigate()
  const filteredRecipes = exampleRecipes.filter((recipe) => recipe.recipeTitle.toLowerCase().includes(query.toLowerCase()))

  const handleDetailClick = (id) => {
    navigate(`/recipes/${id}`)
  }

  const handleSearch = (query) => {
    navigate(`/search?query=${query}`)
  }

  return (
    <div className="base-div">
      <SearchBarRecipe onSearch={handleSearch} initialQuery={query} />
      <div className="recipe-parent-div">
        <div className="recipe-card-div">
          <div className="d-flex justify-content-between align-items-center mt-0" style={{ padding: "0 20px" }}>
            <button onClick={() => navigate(-1)} className="back-button">
              <img src="/images/previous_button.png" alt="Previous" className="icon" />
              이전
            </button>
            <h3>
              "{query}"에 대한 검색 결과가 {filteredRecipes.length}개 있습니다.
            </h3>
          </div>
          <div className="recipe-list2">
            {filteredRecipes.map((recipe) => (
              <div key={recipe.recipeId} className="recipe-card2 recipe-card2-small" onClick={() => handleDetailClick(recipe.recipeId)}>
                <img src={recipe.image} alt={recipe.recipeTitle} className="recipe-image2" />
                <div className="recipe-info2">
                  <h2>{recipe.recipeTitle}</h2>
                  <div className="profile-info">
                    <img src={recipe.userImage} alt={`${recipe.nickname} 프로필`} className="profile-image2" />
                    <p>{recipe.nickname}</p>
                  </div>
                </div>
              </div>
            ))}
            {filteredRecipes.length === 0 && <p>검색 결과가 없습니다.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecipeSearchResultPage
