import React, { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import "../../styles/recipe/DemoCookingPage.css"

import RecipeInfo from "../../components/recipe/RecipeInfo"
import HandTutorial from "../../components/recipe/HandTutorial"
import VoiceTutorial from "../../components/recipe/VoiceTutorial"
import HandPoseComponent from "../../components/handmotion/HandPoseComponent"

import Welcome from "../../components/recipe/Welcome"
import CookingDonePage from "../../components/recipe/CookingDonePage"

const DemoCookingPage = () => {
  const location = useLocation()
  const recipe = location.state // passed recipe data
  const navigate = useNavigate()

  const [componentPage, setComponentPage] = useState(0) // 상태 추가
  const [currentStep, setCurrentStep] = useState(0) // 처음에는 레시피 첫 번째 페이지로 초기화

  const handleNextPage = () => {
    setComponentPage((prevPage) => prevPage + 1)
  }

  const handlePrevPage = () => {
    setComponentPage((prevPage) => Math.max(prevPage - 1, 0))
  }

  const handleSkip = () => {
    setComponentPage(4) // 스킵할 경우 조리 시작 페이지로 이동
  }
  const onClose = () => {
    navigate(`/recipes/${recipe.recipeId}`)
  }
  const handleFeed = (recipe) => {
    navigate("/feed/write", { state: { recipeId: recipe.recipeId, recipeTitle: recipe.recipeTitle } })
  }

  let CurrentComponent
  switch (componentPage) {
    case 0:
      CurrentComponent = Welcome
      break
    case 1:
      CurrentComponent = RecipeInfo
      break
    case 2:
      CurrentComponent = HandTutorial
      break
    case 3:
      CurrentComponent = VoiceTutorial
      break
    case 4:
      CurrentComponent = HandPoseComponent
      break
    case 5:
      CurrentComponent = CookingDonePage
      break
    default:
      CurrentComponent = RecipeInfo
  }
  return (
    <div className="cooking-container">
      <CurrentComponent
        recipe={recipe}
        onNextPage={handleNextPage} // 다음 컴포넌트 이동하기
        onPrevPage={handlePrevPage} // 이전 컴포넌트 이동하기
        onSkip={handleSkip} // 스킵 함수 전달
        onClose={onClose} // 일단은 recipeInfo로 이동해놓게 해놓은 것
        currentStep={currentStep} // process(조리과정)
        onNextStep={() => setCurrentStep((prevStep) => prevStep + 1)}
        onPrevStep={() => setCurrentStep((prevStep) => Math.max(prevStep - 1, 0))}
        handleFeed={handleFeed} // handleFeed 함수 전달
      />
    </div>
  )
}

export default DemoCookingPage
