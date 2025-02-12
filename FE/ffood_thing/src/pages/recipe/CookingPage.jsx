import React, { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import SearchBar from "../../components/base/SearchBar"
import { Recipe } from "./recipe_data"
import Swal from "sweetalert2"
import "../../styles/recipe/RecipeDetailPage.css"
import DemoHandComponent from "../../components/handmotion/DemoHandComponent"

const RecipeDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [activeSection, setActiveSection] = useState("ingredients")
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const recipe = Recipe.find((item) => item.recipeId === parseInt(id))

  const ingredientsRef = useRef(null)
  const stepsRef = useRef(null)
  const completedRef = useRef(null)
  const feedRef = useRef(null)

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.6,
    }

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log("Intersecting:", entry.target.id)
          setActiveSection(entry.target.id)
        }
      })
    }

    const observer = new IntersectionObserver(handleIntersection, options)

    if (ingredientsRef.current) observer.observe(ingredientsRef.current)
    if (stepsRef.current) observer.observe(stepsRef.current)
    if (completedRef.current) observer.observe(completedRef.current)
    if (feedRef.current) observer.observe(feedRef.current)

    return () => {
      if (ingredientsRef.current) observer.unobserve(ingredientsRef.current)
      if (stepsRef.current) observer.unobserve(stepsRef.current)
      if (completedRef.current) observer.unobserve(completedRef.current)
      if (feedRef.current) observer.unobserve(feedRef.current)
    }
  }, [])

  if (!recipe) {
    return <div>Recipe not found</div>
  }

  const handleBookmarkClick = () => {
    if (isBookmarked) {
      Swal.fire({
        title: "북마크 취소!",
        text: "북마크에서 제거했어요.",
        icon: "error",
      }).then(() => {
        setIsBookmarked(false)
      })
    } else {
      Swal.fire({
        title: "북마크완료!",
        text: "북마크에 추가했어요",
        imageUrl: "/images/mainlogo.jpg",
        imageWidth: 350,
        imageHeight: 300,
        imageAlt: "Custom image",
        icon: "success",
      }).then(() => {
        setIsBookmarked(true)
      })
    }
  }

  const getLevelText = (level) => {
    switch (level) {
      case 1:
        return "하"
      case 2:
        return "중"
      case 3:
        return "상"
      default:
        return level
    }
  }

  const scrollToSection = (section) => {
    setActiveSection(section)
    document.getElementById(section).scrollIntoView({ behavior: "smooth" })
  }

  const handleNextStep = () => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, recipe.processes.length - 1))
  }

  const handlePrevStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0))
  }

  return <DemoHandComponent currentStep={currentStep} onNextStep={handleNextStep} onPrevStep={handlePrevStep} />
}

export default RecipeDetailPage
