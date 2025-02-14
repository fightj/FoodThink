import React from "react"
import { useLocation } from "react-router-dom"
import "../../styles/recipe/DemoCookingPage.css" // 스타일을 위한 CSS 파일을 임포트합니다.

import RecipeInfo from "../../components/recipe/Welcome"

const DemoCookingPage = () => {
  const location = useLocation()
  const recipe = location.state // passed recipe data

  return (
    <div className="cooking-container">
      <RecipeInfo recipe={recipe} />
    </div>
  )
}

export default DemoCookingPage
