import React, { useRef, useState } from "react"
import "../../styles/recipe/CookingDonePage.css"

const CookingDonePage = ({ recipe, handleFeed, onClose }) => {
  const representativeImage = recipe.image || "/default-image.png"
  const canvasRef = useRef(null)
  const [capturedImage, setCapturedImage] = useState(null)
  const [defaultImageVisible, setDefaultImageVisible] = useState(true)
  const [overlayVisible, setOverlayVisible] = useState(false)

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setCapturedImage(reader.result)
        setDefaultImageVisible(false)
        setOverlayVisible(true) // 이미지 업로드 후 오버레이 표시
        const img = new Image()
        img.onload = () => {
          const context = canvasRef.current.getContext("2d")
          const canvas = canvasRef.current
          const hRatio = canvas.width / img.width
          const vRatio = canvas.height / img.height
          const ratio = Math.max(hRatio, vRatio) // 캔버스에 이미지를 채우도록 설정
          const centerX = (canvas.width - img.width * ratio) / 2
          const centerY = (canvas.height - img.height * ratio) / 2
          context.clearRect(0, 0, canvas.width, canvas.height) // 기존 이미지를 지우기 위해 캔버스를 초기화
          context.drawImage(img, 0, 0, img.width, img.height, centerX, centerY, img.width * ratio, img.height * ratio) // 캔버스에 이미지 그림
        }
        img.src = reader.result
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFeedWithImage = () => {
    handleFeed(recipe, capturedImage)
  }

  const handleEditImage = () => {
    // 이미지 재업로드를 위한 초기화 작업
    setCapturedImage(null)
    setDefaultImageVisible(true)
    setOverlayVisible(false)
  }

  return (
    <div className="cooking-done-container">
      <h2>맛있는 결과물 완성</h2>
      <div className="comparison-container">
        <img src={representativeImage} alt="Representative Recipe" className="representative-image" />
        <div className="cooked-dish-container">
          {capturedImage ? (
            <div className="image-frame">
              <img src={capturedImage} alt="Your Cooked Dish" className="cooked-dish-image" />
              {overlayVisible && (
                <div className="image-overlay">
                  <button className="overlay-button" onClick={handleFeedWithImage}>
                    업로드하기
                    <img src="/images/feedicon.png" alt="나만의 요리 기록하기" className="button-image" />
                  </button>
                  <button className="overlay-button" onClick={handleEditImage}>
                    사진 다시 고르기
                    <img src="/images/edit-icon.png" alt="이미지 다시 고르기" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="image-frame">
              {defaultImageVisible && <img src="/images/camera-icon.png" alt="Camera Icon" className="camera-icon" />}
              <input type="file" accept="image/*" capture="environment" onChange={handleImageUpload} className="file-input" />
              <canvas ref={canvasRef} className="cooked-dish-canvas" />
            </div>
          )}
          <div className="finish-cook-text">
            <p>내가 완성한 요리를 사진으로 남겨봐요!</p>
          </div>
        </div>
      </div>
      <div className="done-button-container">
        <button className="done-close-button" onClick={onClose}>
          back to recipe
          <img src="/images/recipe-icon.png" alt="레시피로 복귀" className="button-image" />
        </button>
      </div>
    </div>
  )
}

export default CookingDonePage
