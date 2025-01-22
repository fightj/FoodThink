import { useState } from "react"
import { useParams } from "react-router-dom"
import RecipeComponent from "../../components/recipe/RecipeComponent"

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
    },
    2: {
      name: "Spaghetti Carbonara",
      steps: [
        { pageNumber: 1, image: "path/to/image3.jpg", text: "Step 1: Boil pasta." },
        { pageNumber: 2, image: "path/to/image4.jpg", text: "Step 2: Prepare sauce." },
      ],
    },
    3: {
      name: "Chicken Curry",
      steps: [
        { pageNumber: 1, image: "path/to/image5.jpg", text: "Step 1: Marinate chicken." },
        { pageNumber: 2, image: "path/to/image6.jpg", text: "Step 2: Cook curry." },
      ],
    },
  }

  const recipe = recipeDetails[id]

  if (!recipe) {
    return <div>Recipe not found.</div>
  }

  return (
    <div className="recipe-detail-page">
      <h1>{recipe.name}</h1>
      <button onClick={() => setShowModal(true)}>Start Cooking</button>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={() => setShowModal(false)}>
              X
            </button>
            <RecipeComponent pages={recipe.steps} />
          </div>
        </div>
      )}
    </div>
  )
}

export default RecipeDetailPage
