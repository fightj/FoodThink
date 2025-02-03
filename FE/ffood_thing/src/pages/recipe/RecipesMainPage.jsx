import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import "../../styles/recipe/RecipesMainPage.css"
import SearchBar from "../../components/base/SearchBar"

const RecipesMainPage = () => {
  const navigate = useNavigate()
  const [recipes, setRecipes] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])

  const exampleRecipes = [
    
  ]

  useEffect(() => {
    setRecipes(exampleRecipes)
  }, [])

  const handleDetailClick = (id) => {
    navigate(`/recipes/${id}`)
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
      return [...recipes].sort((a, b) => b.id - a.id)
    } else if (sortBy === "조회순") {
      return [...recipes].sort((a, b) => b.views - a.views)
    } else if (sortBy === "북마크순") {
      return [...recipes].sort((a, b) => b.bookmarks - a.bookmarks)
    }
    return recipes
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  }

  const categoryList = {
    종류별: ["반찬", "국/탕", "찌개", "디저트", "면/만두", "밥/죽/떡", "김치/젓갈/장류", "양념/소스/쨈", "양식", "샐러드", "차/음료/술", "기타"],
    재료별: ["소고기", "돼지고기", "닭고기", "육류", "채소류", "해물류", "달걀/유제품", "가공식품", "쌀", "밀가루", "건어물류", "버섯류", "과일류", "콩/견과류", "곡류", "기타"],
  }

  return (
    <div className="base-div">
      <SearchBar />
      <div className="recipe-card-div">
        <div className="categories">
          <div className="category-group">
            <h2>종류별</h2>
            {categoryList.종류별.map((category) => (
              <span key={category} className={`category-item ${selectedCategories.includes(category) ? "selected" : ""}`} onClick={() => handleCategoryClick(category)}>
                {category}
              </span>
            ))}
          </div>
          <div className="category-group">
            <h2>재료별</h2>
            {categoryList.재료별.map((category) => (
              <span key={category} className={`category-item ${selectedCategories.includes(category) ? "selected" : ""}`} onClick={() => handleCategoryClick(category)}>
                {category}
              </span>
            ))}
          </div>
        </div>
        <div className="filters">
          <div className="carousel-wrapper">
            <h3>인기 레시피</h3>
            <Slider {...settings} className="recipe-grid">
              {sortRecipes(filteredRecipes, "북마크순").map((recipe) => (
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
            </Slider>
          </div>
          <div className="carousel-wrapper">
            <h3>맞춤 추천</h3>
            <Slider {...settings} className="recipe-grid">
              {sortRecipes(filteredRecipes, "조회순").map((recipe) => (
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
            </Slider>
          </div>
        </div>
        <div>
          <h3>총 {filteredRecipes.length}개의 레시피가 있습니다.</h3>
        </div>
      </div>
    </div>
  )
}

export default RecipesMainPage
