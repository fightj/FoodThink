import React, { useState, useEffect, useRef, useCallback } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import SearchBarRecipe from "../../components/base/SearchBarRecipe"
import "../../styles/recipe/RecipesMainPage.css"

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

const RecipeSearchResultPage = () => {
  const navigate = useNavigate()
  const [filteredRecipes, setFilteredRecipes] = useState([])
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalResults, setTotalResults] = useState(0)
  const [searchQuery, setSearchQuery] = useState(useQuery().get("query") || "") // 검색어 상태 추가
  const observer = useRef()

  const debounce = (func, delay) => {
    let debounceTimer
    return function (...args) {
      const context = this
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => func.apply(context, args), delay)
    }
  }

  const fetchRecipes = async (query, page, size) => {
    setLoading(true)
    try {
      const params = {
        query,
        page,
        size,
        orderBy: "createdDate",
      }

      const response = await axios.get(`https://i12e107.p.ssafy.io/api/elasticsearch/search/pagenation`, { params })

      setFilteredRecipes((prev) => (page === 0 ? response.data.content : [...prev, ...response.data.content]))
      setTotalPages(response.data.totalPages)
      setTotalResults(response.data.totalElements)
    } catch (error) {
      console.error("Error fetching recipes", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (searchQuery) {
      setFilteredRecipes([])
      setPage(0)
      fetchRecipes(searchQuery, 0, size)
    }
  }, [searchQuery])

  const handleDetailClick = (id) => {
    navigate(`/recipes/${id}`)
  }

  const handleSearch = debounce((query) => {
    setSearchQuery(query) // 검색어 상태 업데이트
  }, 300)

  const lastRecipeElementRef = useCallback(
    (node) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && page < totalPages - 1) {
          setPage((prevPage) => prevPage + 1)
        }
      })
      if (node) observer.current.observe(node)
    },
    [loading, page, totalPages]
  )

  useEffect(() => {
    if (page > 0) {
      fetchRecipes(searchQuery, page, size)
    }
  }, [page])

  return (
    <div className="base-div">
      <SearchBarRecipe onSearch={handleSearch} initialQuery={searchQuery} />
      <div className="recipe-parent-div">
        <div className="recipe-card-div">
          <div className="d-flex justify-content-between align-items-center mt-0" style={{ padding: "0 20px" }}>
            <button onClick={() => navigate(-1)} className="back-button1">
              <img src="/images/previous_button.png" alt="Previous" className="icon" />
              이전
            </button>
            <h3>
              "{searchQuery}"에 대한 검색 결과가 총 {totalResults}개 있습니다.
            </h3>
          </div>
          <div className="recipe-list2">
            {filteredRecipes.map((recipe, index) => (
              <div
                key={recipe.recipeId}
                ref={filteredRecipes.length === index + 1 ? lastRecipeElementRef : null}
                className="recipe-card2 recipe-card2-small"
                onClick={() => handleDetailClick(recipe.recipeId)}
              >
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
            {loading && <p>로딩 중...</p>}
            {filteredRecipes.length === 0 && !loading && <p>검색 결과가 없습니다.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecipeSearchResultPage
