import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "../../styles/recipe/RecipesMainPage.css"
import SearchBarRecipe from "../../components/base/SearchBarRecipe"

const RecipesMainPage = () => {
  const navigate = useNavigate()
  const [top20Recipes, setTop20Recipes] = useState([])
  const [allRecipes, setAllRecipes] = useState([])
  const [cateType, setCateType] = useState("")
  const [cateMainIngre, setCateMainIngre] = useState("")
  const [sortType, setSortType] = useState("조회순")
  const [isCategoryListVisible, setIsCategoryListVisible] = useState(true)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const carouselRef1 = useRef(null)
  const carouselRef2 = useRef(null)

  useEffect(() => {
    const fetchTop20Recipes = async () => {
      try {
        const response = await axios.get("https://i12e107.p.ssafy.io/api/recipes/read/recipeList/top20/hits")
        setTop20Recipes(response.data)
      } catch (error) {
        console.error("Error fetching the top 20 recipes", error)
        setTop20Recipes([])
      }
    }

    fetchTop20Recipes()
  }, [])

  useEffect(() => {
    const fetchAllRecipes = async () => {
      try {
        const response = await axios.get(`https://i12e107.p.ssafy.io/api/recipes/read/recipeList?cateType=${cateType}&cateMainIngre=${cateMainIngre}&sortType=${sortType}&page=0&size=1000`)
        console.log("Request URL:", response.config.url)
        console.log("Fetched Recipes:", response.data.recipes)
        setAllRecipes(response.data.recipes)
      } catch (error) {
        console.error("Error fetching all recipes", error)
        setAllRecipes([])
      }
    }

    fetchAllRecipes()
  }, [cateType, cateMainIngre, sortType])

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

  const handleCategoryClick = (category, type) => {
    if (type === "cateType") {
      const newCateType = cateType === category ? "" : category
      setCateType(newCateType)
      setIsInitialLoad(false)
      console.log("Selected cateType:", newCateType)
    } else if (type === "cateMainIngre") {
      const newCateMainIngre = cateMainIngre === category ? "" : category
      setCateMainIngre(newCateMainIngre)
      setIsInitialLoad(false)
      console.log("Selected cateMainIngre:", newCateMainIngre)
    }
  }

  const handleSortClick = (sortOption) => {
    setSortType(sortOption)
  }

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

  const categoryList = {
    종류별: ["반찬", "국/탕", "찌개", "디저트", "면/만두", "밥/죽/떡", "김치/젓갈/장류", "양념/소스/쨈", "양식", "샐러드", "차/음료/술", "기타"],
    재료별: ["소고기", "돼지고기", "닭고기", "육류", "채소류", "해물류", "달걀/유제품", "가공식품", "쌀", "밀가루", "건어물류", "버섯류", "과일류", "콩/견과류", "곡류", "기타"],
  }

  const filteredAndSortedRecipes = allRecipes
    .filter((recipe) => (cateType ? recipe.recipeTitle.includes(cateType) : true) && (cateMainIngre ? recipe.recipeTitle.includes(cateMainIngre) : true))
    .sort((a, b) => {
      if (sortType === "최신순") {
        return b.recipeId - a.recipeId
      } else if (sortType === "조회순") {
        return b.hits - a.hits
      } else if (sortType === "북마크순") {
        return b.bookMarkCount - a.bookMarkCount
      }
      return 0
    })
  console.log("Filtered and Sorted Recipes: ", filteredAndSortedRecipes)

  return (
    <div className="base-div">
      <SearchBarRecipe onSearch={handleSearch} />
      <div className="recipe-parent-div">
        <div className="recipe-card-div">
          <div className="d-flex justify-content-between align-items-center mt-0" style={{ padding: "0 20px" }}>
            <h2></h2>
            <button href="/recipes/write" className="write-recipe-button" onClick={() => navigate("/recipes/write")}>
              <img src="/images/feed_write_button.png" alt="Recipe 작성" style={{ cursor: "pointer", width: "50px", height: "50px" }} />
            </button>
          </div>

          {isCategoryListVisible && (
            <div className="categories2">
              <div className="category-group2">
                <h2>종류별</h2>
                <div className="category-items2">
                  {categoryList.종류별.map((category) => (
                    <span key={category} className={`category-item2 ${cateType === category ? "selected" : ""}`} onClick={() => handleCategoryClick(category, "cateType")}>
                      {category}
                    </span>
                  ))}
                </div>
              </div>
              <div className="category-group2">
                <h2>재료별</h2>
                <div className="category-items2">
                  {categoryList.재료별.map((category) => (
                    <span key={category} className={`category-item2 ${cateMainIngre === category ? "selected" : ""}`} onClick={() => handleCategoryClick(category, "cateMainIngre")}>
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
          <button className="category-onoff-button" onClick={() => setIsCategoryListVisible(!isCategoryListVisible)}>
            {isCategoryListVisible ? "카테고리 닫기" : "카테고리 열기"}
          </button>
          {!cateType && !cateMainIngre && (
            <div className="filters2">
              <div className="carousel-wrapper2">
                <h3>인기 레시피</h3>
                <div className="carousel2" ref={carouselRef1}>
                  {sortRecipes(top20Recipes, "북마크순").map((recipe) => (
                    <div key={recipe.recipeId} className="recipe-card2" onClick={() => handleDetailClick(recipe.recipeId)}>
                      <div className="image-container2">
                        <img src={recipe.image} alt={recipe.recipeTitle} className="recipe-image2" />
                        <div className="bookmark-count2">{recipe.bookMarkCount}</div>
                      </div>
                      <div className="recipe-info2">
                        <h2>{recipe.recipeTitle}</h2>
                        <div className="profile-info">
                          <img src={recipe.userImage || "/images/default_profile.png"} alt={`${recipe.nickname} 프로필`} className="profile-image2" />
                          <p>{recipe.nickname}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="carousel-wrapper2">
                <h3>맞춤 추천</h3>
                <div className="carousel2" ref={carouselRef1}>
                  {sortRecipes(top20Recipes, "북마크순").map((recipe) => (
                    <div key={recipe.recipeId} className="recipe-card2" onClick={() => handleDetailClick(recipe.recipeId)}>
                      <div className="image-container2">
                        <img src={recipe.image} alt={recipe.recipeTitle} className="recipe-image2" />
                        <div className="bookmark-count2">{recipe.bookMarkCount}</div>
                      </div>
                      <div className="recipe-info2">
                        <h2>{recipe.recipeTitle}</h2>
                        <div className="profile-info">
                          <img src={recipe.userImage || "/images/default_profile.png"} alt={`${recipe.nickname} 프로필`} className="profile-image2" />
                          <p>{recipe.nickname}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div>
            <h3>총 {filteredAndSortedRecipes.length}개의 레시피가 있습니다.</h3>
            <div className="sort-filters2">
              <span className={`sort-filter2 ${sortType === "조회순" ? "selected" : ""}`} onClick={() => handleSortClick("조회순")}>
                조회순
              </span>
              <span className={`sort-filter2 ${sortType === "최신순" ? "selected" : ""}`} onClick={() => handleSortClick("최신순")}>
                최신순
              </span>
              <span className={`sort-filter2 ${sortType === "북마크순" ? "selected" : ""}`} onClick={() => handleSortClick("북마크순")}>
                북마크순
              </span>
            </div>
            <div className="recipe-list2">
              {filteredAndSortedRecipes.map((recipe) => (
                <div key={recipe.recipeId} className="recipe-card2 recipe-card2-small" onClick={() => handleDetailClick(recipe.recipeId)}>
                  <img src={recipe.image} alt={recipe.recipeTitle} className="recipe-image2" />
                  <div className="recipe-info2">
                    <h2>{recipe.recipeTitle}</h2>
                    <div className="profile-info2">
                      <img src={recipe.userImage || "/images/default_profile.png"} alt={`${recipe.nickname} 프로필`} className="profile-image2" />
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
