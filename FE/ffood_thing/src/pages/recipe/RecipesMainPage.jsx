import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import "../../styles/recipe/RecipesMainPage.css"
import SearchBarRecipe from "../../components/base/SearchBarRecipe"
import { recipes as exampleRecipes } from "./recipe_data" // 레시피 데이터 가져오기

const RecipesMainPage = () => {
  const navigate = useNavigate()
  const [recipes, setRecipes] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const carouselRef1 = useRef(null)
  const carouselRef2 = useRef(null)

  useEffect(() => {
    setRecipes(exampleRecipes)
  }, [])

  useEffect(() => {
    const handleScroll = (ref) => {
      const scrollContainer = ref.current
      if (scrollContainer) {
        const scrollPosition = scrollContainer.scrollLeft
        const scrollWidth = scrollContainer.scrollWidth - scrollContainer.clientWidth

        const scrollPercentage = (scrollPosition / scrollWidth) * 100
        scrollContainer.style.setProperty("--scroll-percentage", scrollPercentage)
      }
    }

    const onScroll1 = () => handleScroll(carouselRef1)
    const onScroll2 = () => handleScroll(carouselRef2)

    const scrollContainer1 = carouselRef1.current
    const scrollContainer2 = carouselRef2.current

    if (scrollContainer1) {
      scrollContainer1.addEventListener("scroll", onScroll1)
    }
    if (scrollContainer2) {
      scrollContainer2.addEventListener("scroll", onScroll2)
    }

    return () => {
      if (scrollContainer1) {
        scrollContainer1.removeEventListener("scroll", onScroll1)
      }
      if (scrollContainer2) {
        scrollContainer2.removeEventListener("scroll", onScroll2)
      }
    }
  }, [])

  const handleDetailClick = (id) => {
    navigate(`/recipes/${id}`)
  }

  const handleSearch = (query) => {
    navigate(`/search?query=${query}`)
  }

  const handleCategoryClick = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    } else {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  const filteredRecipes = recipes.filter((recipe) => selectedCategories.length === 0 || selectedCategories.includes(recipe.category))

  const sortRecipes = (recipes, sortBy) => {
    if (sortBy === "최신순") {
      return [...recipes].sort((a, b) => b.recipeId - a.recipeId)
    } else if (sortBy === "조회순") {
      return [...recipes].sort((a, b) => b.hits - a.hits)
    } else if (sortBy === "북마크순") {
      return [...recipes].sort((a, b) => b.bookMarkCount - a.bookMarkCount)
    }
    return recipes
  }

  const scrollLeft = (ref) => {
    ref.current.scrollBy({ left: -300, behavior: "smooth" })
  }

  const scrollRight = (ref) => {
    ref.current.scrollBy({ left: 300, behavior: "smooth" })
  }

  const categoryList = {
    종류별: ["반찬", "국/탕", "찌개", "디저트", "면/만두", "밥/죽/떡", "김치/젓갈/장류", "양념/소스/쨈", "양식", "샐러드", "차/음료/술", "기타"],
    재료별: ["소고기", "돼지고기", "닭고기", "육류", "채소류", "해물류", "달걀/유제품", "가공식품", "쌀", "밀가루", "건어물류", "버섯류", "과일류", "콩/견과류", "곡류", "기타"],
  }

  return (
    <div className="base-div">
      <SearchBarRecipe onSearch={handleSearch} />
      <div className="recipe-parent-div">
        <div className="recipe-card-div">
          <div className="d-flex justify-content-between align-items-center mt-0" style={{ padding: "0 20px" }}>
            <h2></h2>
            <img src="/images/feed_write_button.png" alt="Recipe 작성" style={{ cursor: "pointer", width: "50px", height: "50px" }} />
          </div>
          <br />
          <div className="categories2">
            <div className="category-group2">
              <h2>종류별</h2>
              <div className="category-items2">
                {categoryList.종류별.map((category) => (
                  <span key={category} className={`category-item2 ${selectedCategories.includes(category) ? "selected" : ""}`} onClick={() => handleCategoryClick(category)}>
                    {category}
                  </span>
                ))}
              </div>
            </div>
            <div className="category-group2">
              <h2>재료별</h2>
              <div className="category-items2">
                {categoryList.재료별.map((category) => (
                  <span key={category} className={`category-item2 ${selectedCategories.includes(category) ? "selected" : ""}`} onClick={() => handleCategoryClick(category)}>
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="filters2">
            <div className="carousel-wrapper2">
              <h3>인기 레시피</h3>
              <div className="carousel2" ref={carouselRef1}>
                {sortRecipes(filteredRecipes, "북마크순").map((recipe) => (
                  <div key={recipe.recipeId} className="recipe-card2" onClick={() => handleDetailClick(recipe.recipeId)}>
                    <div className="image-container">
                      <img src={recipe.image} alt={recipe.recipeTitle} className="recipe-image2" />
                      <div className="bookmark-count2">{recipe.bookMarkCount}</div>
                    </div>
                    <div className="recipe-info2">
                      <h2>{recipe.recipeTitle}</h2>
                      <div className="profile-info">
                        <img src={recipe.userImage} alt={`${recipe.nickname} 프로필`} className="profile-image2" />
                        <p>{recipe.nickname}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="carousel-wrapper2">
              <h3>맞춤 추천</h3>
              <div className="carousel2" ref={carouselRef2}>
                {sortRecipes(filteredRecipes, "북마크순").map((recipe) => (
                  <div key={recipe.recipeId} className="recipe-card2" onClick={() => handleDetailClick(recipe.recipeId)}>
                    <div className="image-container">
                      <img src={recipe.image} alt={recipe.recipeTitle} className="recipe-image2" />
                      <div className="bookmark-count2">{recipe.bookMarkCount}</div>
                    </div>
                    <div className="recipe-info2">
                      <h2>{recipe.recipeTitle}</h2>
                      <div className="profile-info">
                        <img src={recipe.userImage} alt={`${recipe.nickname} 프로필`} className="profile-image2" />
                        <p>{recipe.nickname}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h3>총 {filteredRecipes.length}개의 레시피가 있습니다.</h3>
            <div className="recipe-list2">
              {sortRecipes(filteredRecipes, "조회순").map((recipe) => (
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecipesMainPage
