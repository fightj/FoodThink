import { useState } from "react"
import { useLocation } from "react-router-dom"
import "../../styles/recipe/DemoCookingPage.css" // 스타일을 위한 CSS 파일을 임포트합니다.

<<<<<<< HEAD
=======
import RecipeInfo from "../../components/recipe/RecipeInfo"
import HandTutorial from "../../components/recipe/HandTutorial"
import VoiceTutorial from "../../components/recipe/VoiceTutorial"
import HandPoseComponent from "../../components/handmotion/HandPoseComponent"

>>>>>>> 97f45a57472a4daf9eede4c5ea47d91b7953d6e9
import Welcome from "../../components/recipe/Welcome"

const DemoCookingPage = () => {
  const location = useLocation()
  const recipe = location.state // passed recipe data

  const [componentPage, setComponentPage] = useState(0) // 상태 추가
  const [currentStep, setCurrentStep] = useState(0) // 처음음에는 레시피 첫번째 페이지로 초기화

  const handleNextPage = () => {
    setComponentPage((prevPage) => prevPage + 1)
  }

  const handlePrevPage = () => {
    setComponentPage((prevPage) => Math.max(prevPage - 1, 0))
  }

  const handleSkip = () => {
    setComponentPage(4) // 스킵할 경우 조리 시작 페이지로 이동
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
    default:
      CurrentComponent = RecipeInfo
  }
  console.log(componentPage)
  return (
    <div className="cooking-container">
<<<<<<< HEAD
      <Welcome recipe={recipe} />
=======
      <CurrentComponent
        recipe={recipe}
        onNextPage={handleNextPage} // 다음 컴포넌트 이동하기
        onPrevPage={handlePrevPage} // 이전 컴포넌트 이동하기
        onSkip={handleSkip} // 스킵 함수 전달
        onClose={() => setComponentPage(0)} // 일단은 recipeInfo로 이동해놓게 해놓은것
        currentStep={currentStep} // process(조리과정)
        onNextStep={() => setCurrentStep((prevStep) => prevStep + 1)}
        onPrevStep={() => setCurrentStep((prevStep) => Math.max(prevStep - 1, 0))}
      />
>>>>>>> 97f45a57472a4daf9eede4c5ea47d91b7953d6e9
    </div>
  )
}

export default DemoCookingPage
