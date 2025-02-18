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
  const [activeIndex, setActiveIndex] = useState(1) // 초기에 선택된 아이템을 가운데로 설정
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
  const handleClick = (index,recipeId) => {
    if(activeIndex === index){ // 이미 선택된 아이템을 다시 클릭한 경우 상세페이지로 이동동
      goToRecipeDetail(recipeId);
    }else{ // 새로운 아이템 선택된 경우 activeIndex 업데이트 
      setActiveIndex(index);
    }
  };
  /*📌 터치 슬라이드를 위한 코드*/
  // const moveToCenter = (index) => {
  //   if (index !== activeIndex) {
  //     setActiveIndex(index)

  //     const offset = (index - Math.floor(selectedRecipes.length / 2)) * -300 
  //     const listElement = document.querySelector(".today-recipe-list")
  //     if (listElement) {
  //       listElement.style.transform = `translateX(${offset}px)` 
  //     }
  //   }
  // }
  // const handleTouchStart = (e, index) => {
  //   setStartX(e.touches[0].clientX) // 터치 시작 위치 저장
  //   setIsDragging(true)
  // }

  // const handleTouchMove = (e, index) => {
  //   if (!isDragging) return
  //   const touchX = e.touches[0].clientX
  //   const deltaX = touchX - startX

  //   // 특정 아이템의 translateX 값 업데이트
  //   setItemTransforms((prevTransforms) => prevTransforms.map((transform, i) => (i === index ? deltaX : transform)))
  // }

  // const handleTouchEnd = (index) => {
  //   setIsDragging(false)
  //   console.log(itemTransforms[index])
  //   // 슬라이드 이동 처리
  //   if (itemTransforms[index] > 50) {
  //     slideRight(index) // 오른쪽으로 슬라이드
  //   } else if (itemTransforms[index] < -50) {
  //     slideLeft(index) // 왼쪽으로 슬라이드
  //   }

  //   // 이동 거리 초기화
  //   setItemTransforms((prevTransforms) => prevTransforms.map((transform, i) => (i === index ? 0 : transform)))
  // }

  // const slideLeft = (index) => {
  //   setSelectedRecipes((prevRecipes) => {
  //     const updatedRecipes = [...prevRecipes]
  //     updatedRecipes.push(updatedRecipes.shift()) // 첫 번째 요소를 맨 뒤로 이동
  //     return updatedRecipes
  //   })
  // }

  // const slideRight = (index) => {
  //   setSelectedRecipes((prevRecipes) => {
  //     const updatedRecipes = [...prevRecipes]
  //     updatedRecipes.unshift(updatedRecipes.pop()) // 마지막 요소를 맨 앞으로 이동
  //     return updatedRecipes
  //   })
  // }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="today-recommend-card" onClick={(e) => e.stopPropagation()}>
        <div className="today-header">
          
          <button className="today-refresh-btn" onClick={refreshRecommendations} disabled={loading} >
            <img src="/images/rotate_right.png" alt="새로고침" />
          </button>
          <div className="today-title">
          <FontAwesomeIcon icon={faUtensils} beat style={{ color: "#6c4e32", fontSize: "100%" }} />
            &nbsp;오늘 뭐 먹지?&nbsp;
            <FontAwesomeIcon icon={faUtensils} beat style={{ color: "#6c4e32", fontSize: "100%" }} />
          </div>
          <button className="today-close-btn" onClick={onClose}>
            <img src="/images/close_icon.png" alt="닫기" />
          </button>
        </div>
        {loading ? (
          <div className="today-loading-text">
            <FontAwesomeIcon icon={faUtensils} bounce style={{ color: "#ffc800", fontSize: "200%" }} />
          </div>
        ) : (
          <>
            <div className="today-carousel">
              <div className="today-recipe-list">
                {selectedRecipes.map((recipe, i) => (
                  <div
                    key={recipe.recipeId}
                    className={`today-recipe-item ${activeIndex === i ? "active" : ""}`}
                    onClick={() => handleClick(i, recipe.recipeId)}
                  >
                    <img src={recipe.image} alt={recipe.recipeTitle} className="today-recipe-image" />
                  </div>
                ))}
              </div>
            </div>

            <div className="today-recipe-title-container">
              <p className="today-recipe-title-main">{selectedRecipes[activeIndex].recipeTitle}</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default TodayRecommendModal
