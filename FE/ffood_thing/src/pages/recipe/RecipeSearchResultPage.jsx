import React, { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import SearchBarRecipe from "../../components/base/SearchBarRecipe"
import "../../styles/recipe/RecipesMainPage.css"

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

const FoodPagination = ({ currentPage, totalPages, onPageChange }) => {
  const maxVisibleButtons = 10
  let startPage = Math.floor(currentPage / maxVisibleButtons) * maxVisibleButtons

  if (startPage + maxVisibleButtons > totalPages) {
    startPage = Math.max(0, totalPages - maxVisibleButtons)
  }

  const foodText = Array.from({ length: maxVisibleButtons }, (_, index) => {
    const pageIndex = startPage + index
    return pageIndex < totalPages ? "o" : null
  })

  return (
    <div className="pagination">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 0} className="navigation-button">
        F
      </button>
      {foodText.map((char, index) => {
        if (char === null) return null
        const pageIndex = startPage + index
        return (
          <div key={index} className="page-button">
            <button className={pageIndex === currentPage ? "active" : ""} onClick={() => onPageChange(pageIndex)}>
              {char}
            </button>
            <div className="page-number">{pageIndex + 1}</div>
          </div>
        )
      })}
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages - 1} className="navigation-button">
        d
      </button>
    </div>
  )
}

const RecipeSearchResultPage = () => {
  const query = useQuery().get("query")
  const navigate = useNavigate()
  const [filteredRecipes, setFilteredRecipes] = useState([])
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState([])
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(20)
  const [totalPages, setTotalPages] = useState(1)
  const [totalResults, setTotalResults] = useState(0)

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(`https://i12e107.p.ssafy.io/api/elasticsearch/search/pagenation`, {
          params: {
            query,
            page,
            size,
            orderBy: "createdDate", // 기본값: 작성시간순
          },
        })

        setFilteredRecipes(response.data.content)
        setTotalPages(response.data.totalPages)
        setTotalResults(response.data.totalElements)

        // 북마크된 레시피 로컬 스토리지에서 가져오기
        const storedBookmarks = JSON.parse(localStorage.getItem("bookmarkedRecipes")) || []
        setBookmarkedRecipes(storedBookmarks)
      } catch (error) {
        console.error("Error fetching recipes", error)
        setFilteredRecipes([])
      }
    }

    if (query) {
      fetchRecipes()
    }
  }, [query, page, size])

  const handleDetailClick = (id) => {
    navigate(`/recipes/${id}`)
  }

  const handleSearch = (query) => {
    navigate(`/search?query=${query}`)
  }

  const handleBookmarkClick = (recipeId) => {
    let updatedBookmarks = []
    if (bookmarkedRecipes.includes(recipeId)) {
      // 북마크 제거
      updatedBookmarks = bookmarkedRecipes.filter((id) => id !== recipeId)
    } else {
      // 북마크 추가
      updatedBookmarks = [...bookmarkedRecipes, recipeId]
    }
    setBookmarkedRecipes(updatedBookmarks)
    localStorage.setItem("bookmarkedRecipes", JSON.stringify(updatedBookmarks)) // 로컬 스토리지에 저장
  }

  const handlePageChange = (newPage) => {
    setPage(newPage)
  }

  return (
    <div className="base-div">
      <SearchBarRecipe onSearch={handleSearch} initialQuery={query} />
      <div className="recipe-parent-div">
        <div className="recipe-card-div">
          <div className="d-flex justify-content-between align-items-center mt-0" style={{ padding: "0 20px" }}>
            <button onClick={() => navigate(-1)} className="back-button1">
              <img src="/images/previous_button.png" alt="Previous" className="icon" />
              이전
            </button>
            <h3>
              "{query}"에 대한 검색 결과가 {totalResults}개 있습니다.
            </h3>
          </div>
          <div className="recipe-list2">
            {filteredRecipes.map((recipe) => (
              <div key={recipe.recipeId} className="recipe-card2 recipe-card2-small" onClick={() => handleDetailClick(recipe.recipeId)}>
                <img src={recipe.image} alt={recipe.recipeTitle} className="recipe-image2" />
                <div className="recipe-info2">
                  <h2>{recipe.recipeTitle}</h2>
                  <div className="profile-info">
                    <img src={recipe.userImage || "/images/default_profile.png"} alt={`${recipe.nickname} 프로필`} className="profile-image2" />
                    <p>{recipe.nickname}</p>
                  </div>
                </div>
              </div>
            ))}
            {filteredRecipes.length === 0 && <p>검색 결과가 없습니다.</p>}
          </div>
          <FoodPagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      </div>
    </div>
  )
}

export default RecipeSearchResultPage
