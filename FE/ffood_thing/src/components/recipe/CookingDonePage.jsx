import React, { useRef, useState } from "react"
import "../../styles/recipe/CookingDonePage.css"

const CookingDonePage = ({ recipe, handleFeed, onClose }) => {
  const representativeImage = recipe.image || "/default-image.png"
  const canvasRef = useRef(null)
  const [capturedImage, setCapturedImage] = useState(null)

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setCapturedImage(reader.result)
        const img = new Image()
        img.onload = () => {
          const context = canvasRef.current.getContext("2d")
          context.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height)
        }
        img.src = reader.result
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFeedWithImage = () => {
    handleFeed(recipe, capturedImage)
  }

  return (
    <div className="cooking-done-container">
      <h2>조리 완료!</h2>
      <div className="comparison-container">
        <img src={representativeImage} alt="Representative Recipe" className="representative-image" />
        <div className="cooked-dish-container">
          {capturedImage ? (
            <img src={capturedImage} alt="Your Cooked Dish" className="cooked-dish-image" />
          ) : (
            <div className="image-frame">
              <input type="file" accept="image/*" capture="environment" onChange={handleImageUpload} className="file-input" />
              <canvas ref={canvasRef} className="cooked-dish-canvas" />
            </div>
          )}
        </div>
      </div>
      <button className="feedwrite-done-button" onClick={handleFeedWithImage}>
        피드 작성하기
      </button>
      <button onClick={onClose}>닫기</button>
    </div>
  )
}

export default CookingDonePage
