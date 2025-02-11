import React from "react"
import Modal from "react-bootstrap/Modal"

function RecipeModal({ show, onHide, recipe }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>레시피 정보</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {recipe ? (
          <div style={{ textAlign: "center" }}>
            <img src={recipe.image} className="recipe-image-sns" alt="레시피 이미지" />
            <p className="recipe-title1">{recipe.recipeTitle}</p>
            <p>조회수: {recipe.hits}</p>
          </div>
        ) : (
          <p>연결된 레시피가 없습니다.</p>
        )}
      </Modal.Body>
    </Modal>
  )
}

export default RecipeModal
