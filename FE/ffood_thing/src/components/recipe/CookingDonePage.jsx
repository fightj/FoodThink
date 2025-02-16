import React from "react"
import "../../styles/recipe/CookingDonePage.css"

const CookingDonePage = ({ recipe, handleFeed, onClose }) => {
  return (
    <div className="cooking-done-container">
      <h2>조리 완료!</h2>
      <button onClick={() => handleFeed(recipe)}>피드 작성하기</button>
      <button onClick={onClose}>닫기</button>
    </div>
  )
}

export default CookingDonePage
