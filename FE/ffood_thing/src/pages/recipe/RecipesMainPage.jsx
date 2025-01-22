import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../../styles/recipe/RecipesMainPage.css" // styles 폴더에서 가져옴

const RecipesMainPage = () => {
  const navigate = useNavigate()
  const [recipes, setRecipes] = useState([])

  const exampleRecipes = [
    {
      id: 1,
      title: "Chocolate Cake",
      author: "John Doe",
      image: "https://via.placeholder.com/300?text=Chocolate+Cake",
    },
    {
      id: 2,
      title: "Pasta Carbonara",
      author: "Jane Smith",
      image: "https://via.placeholder.com/300?text=Pasta+Carbonara",
    },
    {
      id: 3,
      title: "Caesar Salad",
      author: "Alice Johnson",
      image: "https://via.placeholder.com/300?text=Caesar+Salad",
    },
    {
      id: 4,
      title: "Tiramisu",
      author: "Bob Brown",
      image: "https://via.placeholder.com/300?text=Tiramisu",
    },
    {
      id: 5,
      title: "Vegetable Stir Fry",
      author: "Chris Lee",
      image: "https://via.placeholder.com/300?text=Vegetable+Stir+Fry",
    },
    {
      id: 6,
      title: "Homemade Pizza",
      author: "Sarah Kim",
      image: "https://via.placeholder.com/300?text=Homemade+Pizza",
    },
  ]

  useEffect(() => {
    setRecipes(exampleRecipes)
  }, []) // 빈 배열로 설정하여 처음 렌더링될 때만 실행

  const handleDetailClick = (id) => {
    navigate(`/recipes/${id}`)
  }

  return (
    <div className="recipes-main-page">
      <h1>Recipes</h1>
      <div className="recipe-grid">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <img src={recipe.image} alt={recipe.title} className="recipe-image" />
            <div className="recipe-info">
              <h2>{recipe.title}</h2>
              <p>By: {recipe.author}</p>
              <button className="detail-button" onClick={() => handleDetailClick(recipe.id)}>
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecipesMainPage
