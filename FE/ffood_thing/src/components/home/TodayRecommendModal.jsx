import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../../styles/recommend/TodayRecommendModal.css"
import { FaRedo } from "react-icons/fa"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { library } from "@fortawesome/fontawesome-svg-core"
import { faUtensils } from "@fortawesome/free-solid-svg-icons"
import { faQuestion } from "@fortawesome/free-solid-svg-icons"

const API_URL = "https://i12e107.p.ssafy.io/api/today-recommend/random"

const TodayRecommendModal = ({ isOpen, onClose }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  //const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [startX, setStartX] = useState(0) // 터치 시작 위치
  const [currentTranslate, setCurrentTranslate] = useState(0) // 현재 translateX 값
  const [isDragging, setIsDragging] = useState(false) // 드래그 상태
  const [selectedRecipes, setSelectedRecipes] = useState([
    { recipeId: 1, image: "/images/recipe1.jpg", recipeTitle: "Recipe 1" },
    { recipeId: 2, image: "/images/recipe2.jpg", recipeTitle: "Recipe 2" },
    { recipeId: 3, image: "/images/recipe3.jpg", recipeTitle: "Recipe 3" },
  ])
  const [centerIndex, setCenterIndex] = useState(1)
  const [itemTransforms, setItemTransforms] = useState(
    selectedRecipes.map(() => 0) // 초기값: 모든 아이템의 translateX = 0
  )

  useEffect(() => {
    if (isOpen) {
      const storedRecipes = localStorage.getItem("todaySelectedRecipes")
      if (storedRecipes) {
        setSelectedRecipes(JSON.parse(storedRecipes))
      } else {
        fetchTodayRecommendations()
      }
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  const fetchTodayRecommendations = async () => {
    setLoading(true)
    try {
      const response = await fetch(API_URL)
      if (!response.ok) throw new Error(`서버 응답 오류: ${response.status}`)
      const data = await response.json()
      if (Array.isArray(data) && data.length === 3) {
        setSelectedRecipes(data)
        localStorage.setItem("todaySelectedRecipes", JSON.stringify(data))
      } else {
        throw new Error("추천 레시피 데이터가 올바르지 않습니다.")
      }
    } catch (error) {
      console.error("❌ 오늘의 추천 레시피 불러오기 실패:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || selectedRecipes.length < 3) return null

  const goToRecipeDetail = (recipeId) => {
    navigate(`/recipes/${recipeId}`)
    onClose()
  }

  // const moveToCenter = (index) => {
  //   if (index !== activeIndex) {
  //     setActiveIndex(index);
  //   }
  // };

  const refreshRecommendations = () => {
    localStorage.removeItem("todaySelectedRecipes")
    fetchTodayRecommendations()
  }
  const moveToCenter = (index) => {
    if (index !== activeIndex) {
      setActiveIndex(index)

      const offset = (index - Math.floor(selectedRecipes.length / 2)) * -300 
      const listElement = document.querySelector(".today-recipe-list")
      if (listElement) {
        listElement.style.transform = `translateX(${offset}px)` 
      }
    }
  }
  const handleTouchStart = (e, index) => {
    setStartX(e.touches[0].clientX) // 터치 시작 위치 저장
    setIsDragging(true)
  }

  const handleTouchMove = (e, index) => {
    if (!isDragging) return
    const touchX = e.touches[0].clientX
    const deltaX = touchX - startX

    // 특정 아이템의 translateX 값 업데이트
    setItemTransforms((prevTransforms) => prevTransforms.map((transform, i) => (i === index ? deltaX : transform)))
  }

  const handleTouchEnd = (index) => {
    setIsDragging(false)

    // 슬라이드 이동 처리
    if (itemTransforms[index] > 50) {
      slideRight(index) // 오른쪽으로 슬라이드
    } else if (itemTransforms[index] < -50) {
      slideLeft(index) // 왼쪽으로 슬라이드
    }

    // 이동 거리 초기화
    setItemTransforms((prevTransforms) => prevTransforms.map((transform, i) => (i === index ? 0 : transform)))
  }

  const slideLeft = (index) => {
    setSelectedRecipes((prevRecipes) => {
      const updatedRecipes = [...prevRecipes]
      updatedRecipes.push(updatedRecipes.shift()) // 첫 번째 요소를 맨 뒤로 이동
      return updatedRecipes
    })
  }

  const slideRight = (index) => {
    setSelectedRecipes((prevRecipes) => {
      const updatedRecipes = [...prevRecipes]
      updatedRecipes.unshift(updatedRecipes.pop()) // 마지막 요소를 맨 앞으로 이동
      return updatedRecipes
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="today-recommend-card" onClick={(e) => e.stopPropagation()}>
        <button className="today-close-btn" onClick={onClose}>
          <img src="/images/close_icon.png" alt="닫기" />
        </button>
        <button className="refresh-btn" onClick={refreshRecommendations} disabled={loading}>
          <img src="/images/rotate_right.png" alt="닫기" />
        </button>
        <div className="today-title">
          오늘 뭐 먹지&nbsp;
          <FontAwesomeIcon icon={faUtensils} bounce style={{ color: "#fdb13f", fontSize: "100%" }} />
        </div>
        {loading ? (
          <div className="loading-text">
            <FontAwesomeIcon icon={faUtensils} bounce style={{ color: "#ffc800", fontSize: "200%" }} />
          </div>
        ) : (
          <>
            <div className="today-carousel">
              <div className="today-recipe-list">
                {selectedRecipes.map((recipe, i) => (
                  <div
                    key={recipe.recipeId}
                    className={`today-recipe-item ${i === centerIndex ? "active" : ""}`}
                    style={{
                      transform: `translateX(${itemTransforms[i]}px)`,
                      transition: isDragging ? "none" : "transform 0.3s ease-in-out",
                    }}
                    onTouchStart={(e) => handleTouchStart(e, i)}
                    onTouchMove={(e) => handleTouchMove(e, i)}
                    onTouchEnd={() => handleTouchEnd(i)}
                    onClick={() => i === centerIndex && goToRecipeDetail(recipe.recipeId)} // 중앙 아이템 클릭 시 상세 페이지로 이동
                  >
                    <img src={recipe.image} alt={recipe.recipeTitle} className="today-recipe-image" />
                  </div>
                ))}
              </div>
            </div>

            <div className="recipe-title-container">
              <p className="today-recipe-title-main">{selectedRecipes[activeIndex].recipeTitle}</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default TodayRecommendModal
