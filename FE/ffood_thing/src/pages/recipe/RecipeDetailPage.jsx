import { useState, useEffect, useRef, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { UserContext } from "../../contexts/UserContext"
import RecipeComponent from "../../components/recipe/RecipeComponent"
import HandPoseComponent from "../../components/handmotion/HandPoseComponent"
import SearchBar from "../../components/base/SearchBar"
import Swal from "sweetalert2"
import "../../styles/recipe/RecipeDetailPage.css"
import "../../styles/base/global.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronUp } from "@fortawesome/free-solid-svg-icons"
import "../../styles/base/global.css"

const RecipeDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, setUser } = useContext(UserContext)
  const [recipe, setRecipe] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [activeSection, setActiveSection] = useState("ingredients")
  const [isBookmarked, setIsBookmarked] = useState(false)

  const ingredientsRef = useRef(null)
  const stepsRef = useRef(null)
  const completedRef = useRef(null)
  const feedRef = useRef(null)

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`https://i12e107.p.ssafy.io/api/recipes/read/detail/${id}`, {
          headers: user
            ? {
                Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`, // null 체크 후 빈 문자열 대입
              }
            : {},
        })

        // Check if response and response.data are valid
        if (response && response.data) {
          setRecipe(response.data)
        } else {
          console.error("Recipe response data is invalid:", response)
        }

        if (user) {
          const bookmarkResponse = await axios.get(`https://i12e107.p.ssafy.io/api/bookmark/read/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}` },
          })

          // Check if bookmarkResponse and bookmarkResponse.data are valid
          if (bookmarkResponse && bookmarkResponse.data !== undefined) {
            setIsBookmarked(bookmarkResponse.data)
          } else {
            console.error("Bookmark response data is invalid:", bookmarkResponse)
          }
        }
      } catch (error) {
        console.error("Error fetching recipe details", error)
        if (error.response && error.response.status === 401) {
          Swal.fire({
            title: "인증 오류!",
            text: "로그인이 필요합니다.",
            icon: "error",
          }).then(() => {
            navigate("/login")
          })
        }
      }
    }

    // 로컬 스토리지에서 북마크 상태 불러오기
    const bookmarkStatus = localStorage.getItem(`bookmark_${id}`)
    if (bookmarkStatus !== null) {
      setIsBookmarked(bookmarkStatus === "true") // "true"이면 true, 아니면 false
    }

    fetchRecipe()
  }, [id, navigate, user])

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.6,
    }

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
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
    return <div>Loading...</div>
  }

  // 북마크 상태가 변경될 때 로컬 스토리지 업데이트
  const handleBookmarkClick = async () => {
    if (!user) {
      Swal.fire({
        title: "로그인 필요!",
        text: "북마크를 사용하려면 로그인하세요.",
        icon: "warning",
      }).then(() => {
        navigate("/login")
      })
      return
    }

    const accessToken = localStorage.getItem("accessToken")
    if (!accessToken) {
      Swal.fire({
        title: "인증 오류!",
        text: "로그인이 필요합니다.",
        icon: "error",
      })
      return
    }

    try {
      const checkResponse = await axios.get(`https://i12e107.p.ssafy.io/api/bookmark/read/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      const isBookmarked = checkResponse.data

      let response

      if (isBookmarked) {
        response = await axios.delete(`https://i12e107.p.ssafy.io/api/bookmark/delete/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        if (response.status !== 200) throw new Error("북마크 삭제 실패")
      } else {
        response = await axios.post(
          `https://i12e107.p.ssafy.io/api/bookmark/create/${id}`,
          {},
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        )

        if (![200, 201].includes(response.status)) {
          throw new Error(`북마크 추가 실패. 상태 코드: ${response.status}`)
        }
      }

      const newBookmarkStatus = !isBookmarked
      setIsBookmarked(newBookmarkStatus)
      localStorage.setItem(`bookmark_${id}`, newBookmarkStatus.toString()) // 로컬 스토리지에 북마크 상태 저장
      Swal.fire({
        title: isBookmarked ? "북마크 취소!" : "북마크 완료!",
        text: isBookmarked ? "북마크에서 제거했어요." : "북마크에 추가했어요.",
        icon: "success",
      })
    } catch (error) {
      console.error("북마크 처리 중 오류 발생", error)

      if (error.response) {
        console.error("응답 에러 상태 코드:", error.response.status)
        console.error("응답 에러 데이터:", error.response.data)
      }
      Swal.fire({
        title: "오류 발생",
        text: error.response ? `상태 코드: ${error.response.status}` : "북마크 상태를 업데이트하는 데 실패했습니다.",
        icon: "error",
      })
    }
  }

  const handleEditClick = () => {
    navigate(`/recipes/update/${id}`)
  }

  const handleDeleteClick = async () => {
    try {
      await axios.delete(`https://i12e107.p.ssafy.io/api/myOwnRecipe/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      Swal.fire({
        title: "삭제 완료",
        text: "레시피가 삭제되었습니다.",
        icon: "success",
      }).then(() => {
        navigate("/recipes")
      })
    } catch (error) {
      console.error("Error deleting recipe", error)
      Swal.fire({
        title: "삭제 실패",
        text: "레시피 삭제에 실패했습니다.",
        icon: "error",
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

  // 페이지 맨 위로 스크롤하는 함수
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth"})
  }

  return (
    <div className="base-div">
      <SearchBar />
      {/* <div className="parent-container"> */}
      <div className="card-div">
        <div style={{ width: "90%", margin: "0 auto" }}>
          <button onClick={() => navigate(-1)} className="back-button">
            <img src="/images/previous_button.png" alt="Previous" className="icon" />
          </button>
          <div style={{ display: "flex", gap: "2rem", marginBottom: "100px" }}>
            <div className="recipe-main-images" style={{ flex: "0 0 60%", position: "relative" }}>
              <img src={recipe.image} alt="Recipe Image" className="recipe-image1" />
              <button className="bookmark-icon-btn" onClick={handleBookmarkClick}>
                <img src={isBookmarked ? "/images/do-Bookmark.png" : "/images/undo-Bookmark.png"} alt="북마크 아이콘" className="bookmark-icon" />
              </button>
              <div className="hit-eye-icon-area">
                <img src="/images/hit-eye.png" alt="" className="hit-eye-icon" />
                <p>{recipe.hits}</p>
              </div>
              <img src={recipe.userImage || "/images/default_profile.png"} alt="프로필이미지" className="profile-image" onClick={() => navigate(`/profile/${recipe.nickname}`)} />
              <div className="nickname-container">{recipe.nickname}</div>
            </div>

            <div style={{ flex: "0 0 40%", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div className="title-container">
                <h1>{recipe.recipeTitle}</h1>
              </div>
              <div className="icon-container">
                <div className="icon-item">
                  <img src="/images/serving.png" alt="Serving" />
                  <p>{recipe.serving}</p>
                </div>
                <div className="icon-item">
                  <img src="/images/level.png" alt="Level" />
                  <p>{getLevelText(recipe.level)}</p>
                </div>
                <div className="icon-item">
                  <img src="/images/timerequired.png" alt="Time Required" />
                  <p>{recipe.requiredTime}</p>
                </div>
              </div>

              <button
                className="cook-btn"
                onClick={() => {
                  Swal.fire({
                    title: "요리 하러 가보실까요?",
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonText: "네",
                    cancelButtonText: "아니요",
                    customClass: {
                      popup: "custom-swal-popup", // 공통 CSS 클래스 적용
                    },
                  }).then((result) => {
                    if (result.isConfirmed) {
                      console.log("Navigating with recipe:", recipe)
                      navigate(`/recipes/${recipe.recipeId}/cooking`, { state: recipe })
                    }
                  })
                }}
              >
                조리시작
              </button>
            </div>
          </div>

          {showModal && (
            <div className="modal-overlay3">
              <div className="modal-content3">
                <button className="close-button3" onClick={() => setShowModal(false)}>
                  X
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* 페이지 맨 위로 올라가는 버튼 */}
      <div className="recipe-detail-page-scroll-to-top-div" onClick={scrollToTop}>
        <FontAwesomeIcon icon={faChevronUp} size="lg" />
        <span className="recipe-detail-page-top-text">TOP</span>
      </div>

      {/* </div> */}

      <div className="card-div-firstsection">
        <button className={activeSection === "ingredients" ? "active" : ""} onClick={() => scrollToSection("ingredients")}>
          재료
        </button>
        <button className={activeSection === "steps" ? "active" : ""} onClick={() => scrollToSection("steps")}>
          조리순서
        </button>
        <button className={activeSection === "feed" ? "active" : ""} onClick={() => scrollToSection("feed")}>
          FEED
        </button>
      </div>

      <div className="parent-container">
        <div id="ingredients" ref={ingredientsRef} className="card-div-section">
          <h1 className="section-title">재료</h1>
          <div className="left-half">
            {recipe.ingredients.map((ingredient, index) => {
              if (index % 2 === 0) {
                return (
                  <div key={index} className="ingredient-item">
                    <span className="ingredient-name">{ingredient.ingreName}</span>
                    <span>{ingredient.amount}</span>
                  </div>
                )
              }
              return null
            })}
          </div>
          <div className="right-half">
            {recipe.ingredients.map((ingredient, index) => {
              if (index % 2 !== 0) {
                return (
                  <div key={index} className="ingredient-item">
                    <span className="ingredient-name">{ingredient.ingreName}</span>
                    <span>{ingredient.amount}</span>
                  </div>
                )
              }
              return null
            })}
          </div>
        </div>
      </div>

      <div className="parent-container">
        <div id="steps" ref={stepsRef} className="card-div-section">
          <h1 className="section-title">조리순서</h1>
          <div className="steps">
            {recipe.processes.map((process, index) => (
              <div key={index} className="process-item">
                <h2>
                  {process.processOrder}. {process.processExplain}
                </h2>
                {process.images && process.images.map((image, imgIndex) => <img key={imgIndex} src={image.imageUrl} alt={`Process ${process.processOrder}`} className="process-image" />)}
                <hr />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="parent-container">
        <div id="feed" ref={feedRef} className="card-div-section">
          <h1 className="section-title">관련 Feed</h1>
        </div>
      </div>

      {user && user.nickname === recipe.nickname && (
        <div className="button-container">
          <button onClick={handleEditClick} className="edit-button">
            수정
          </button>
          <button onClick={handleDeleteClick} className="delete-button">
            삭제
          </button>
        </div>
      )}
    </div>
  )
}

export default RecipeDetailPage
