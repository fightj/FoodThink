import React from "react"
import { useState } from "react"
import { useParams } from "react-router-dom"
import RecipeComponent from "../../components/recipe/RecipeComponent"
import HandPoseComponent from "../../components/handmotion/HandPoseComponent" // HandPoseComponent 임포트
import "../../styles/recipe/RecipeDetailPage.css" // RecipeDetailPage.css 임포트

const RecipeDetailPage = () => {
  const { id } = useParams()
  const [showModal, setShowModal] = useState(false)

  const recipeDetails = {
    1: {
      name: "Chocolate Cake",
      steps: [
        { pageNumber: 1, image: "path/to/image1.jpg", text: "Step 1: Gather ingredients." },
        { pageNumber: 2, image: "path/to/image2.jpg", text: "Step 2: Mix ingredients." },
      ],
      image: "path/to/chocolate_cake.jpg", // 추가된 이미지 경로
    },
    2: {
      name: "Spaghetti Carbonara",
      steps: [
        { pageNumber: 1, image: "path/to/image3.jpg", text: "Step 1: Boil pasta." },
        { pageNumber: 2, image: "path/to/image4.jpg", text: "Step 2: Prepare sauce." },
      ],
      image: "path/to/spaghetti_carbonara.jpg", // 추가된 이미지 경로
    },
    3: {
      name: "Chicken Curry",
      steps: [
        { pageNumber: 1, image: "path/to/image5.jpg", text: "Step 1: Marinate chicken." },
        { pageNumber: 2, image: "path/to/image6.jpg", text: "Step 2: Cook curry." },
      ],
      image: "path/to/chicken_curry.jpg", // 추가된 이미지 경로
    },
  }

  const recipe = recipeDetails[id]

  if (!recipe) {
    return <div>Recipe not found.</div>
  }

  return (
    <div className="recipe-detail-page">
      <div className="recipe-header">
        <h1>{recipe.name}</h1>
        <img src={recipe.image} alt={recipe.name} className="recipe-image" />
      </div>
      <button className="start-button" onClick={() => setShowModal(true)}>
        요리 시작
      </button>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={() => setShowModal(false)}>
              X
            </button>
            <HandPoseComponent
              onNextPage={() => {
                /* 다음 페이지로 이동하는 로직 구현 */
              }}
              onPrevPage={() => {
                /* 이전 페이지로 이동하는 로직 구현 */
              }}
            />
            <RecipeComponent pages={recipe.steps} />
          </div>
        </div>
      )}
    </div>
  )
}

export default RecipeDetailPage
