import React, { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import RecipeComponent from "../../components/recipe/RecipeComponent"
import HandPoseComponent from "../../components/handmotion/HandPoseComponent" // HandPoseComponent 임포트
import SearchBar from "../../components/base/SearchBar"
import { Recipe } from "./recipe_data"
import "../../styles/recipe/RecipeDetailPage.css"

const RecipeDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)

  const recipe = Recipe.find((item) => item.recipeId === parseInt(id))

  if (!recipe) {
    return <div>Recipe not found</div>
  }

  const getLevelText = (level) => {
    switch (level) {
      case 1:
        return "하"
      case 2:
        return "중"
      case 3:
        return "상"
      default:
        return level
    }
  }

  const scrollToSection = (section) => {
    document.getElementById(section).scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="base-div">
      <SearchBar />
      <div className="card-div-topsection">
        <div style={{ width: "90%", margin: "0 auto" }}>
          <button onClick={() => navigate(-1)} className="back-button">
            <img src="/images/previous_button.png" alt="Previous" className="icon" />
            이전
          </button>

          <div style={{ display: "flex", gap: "2rem", marginBottom: "100px" }}>
            <div style={{ flex: "0 0 60%", position: "relative" }}>
              <img src={recipe.image} alt="Recipe Image" className="recipe-image1" />
              <img src={recipe.userImage} alt="프로필이미지" className="profile-image" />
              <div className="nickname-container">
                <h2 className="nickname-area">{recipe.nickname}</h2>
                <button className="sub-btn">구독</button>
              </div>
            </div>

            <div style={{ flex: "0 0 40%", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div className="title-container">
                <h1>{recipe.recipeTitle}</h1>
              </div>
              <div className="icon-container">
                <div className="icon-item">
                  <img src="/images/serving.png" alt="Serving" />
                  <p>{recipe.serving}</p>
                </div>
                <div className="icon-item">
                  <img src="/images/level.png" alt="Level" />
                  <p>{getLevelText(recipe.level)}</p>
                </div>
                <div className="icon-item">
                  <img src="/images/timerequired.png" alt="Time Required" />
                  <p>{recipe.requiredTime}</p>
                </div>
              </div>
              <button className="feed-btn" onClick={() => setShowModal(true)}>
                Feed 작성
              </button>
              <button className="cook-btn" onClick={() => setShowModal(true)}>
                조리시작
              </button>
            </div>
          </div>

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
                <RecipeComponent pages={recipe.processes} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="card-div-firstsection">
        <button onClick={() => scrollToSection("ingredients")}>재료</button>
        <button onClick={() => scrollToSection("steps")}>조리순서</button>
        <button onClick={() => scrollToSection("completed")}>완성 이미지</button>
        <button onClick={() => scrollToSection("feed")}>FEED</button>
      </div>

      {/* Sections */}
      <div id="ingredients" className="card-div-section">
        <h1>재료</h1>
      </div>
      <div id="steps" className="card-div-section">
        <h1>조리 순서</h1>
      </div>
      <div id="completed" className="card-div-section">
        <h1>완성 이미지</h1>
      </div>
      <div id="feed" className="card-div-section">
        <h1>FEED</h1>
      </div>
    </div>
  )
}

export default RecipeDetailPage
