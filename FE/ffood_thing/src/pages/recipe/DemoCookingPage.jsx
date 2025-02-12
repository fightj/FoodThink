import React from "react"
import "../../styles/recipe/DemoCookingPage.css" // 스타일을 위한 CSS 파일을 임포트합니다.
import Tutorial from "../../components/recipe/Tutorial"
import RecipeInfo from "../../components/recipe/RecipeInfo"

const DemoCookingPage = () => {
  return (
    <div className="cooking-container">
      <div className="top-half">
        <RecipeInfo />
      </div>
      <div className="bottom-half">
        <Tutorial />
      </div>
    </div>
  )
}

export default DemoCookingPage
