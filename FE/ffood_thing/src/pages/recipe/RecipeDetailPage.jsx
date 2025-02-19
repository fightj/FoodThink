import { useState, useEffect, useContext, Fragment } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { UserContext } from "../../contexts/UserContext"
import Logo from "../../components/base/Logo"
import Swal from "sweetalert2"
import "../../styles/recipe/RecipeDetailPage.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronUp, faChevronLeft } from "@fortawesome/free-solid-svg-icons"
import "../../styles/base/global.css"

const RecipeDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(UserContext)
  const [recipe, setRecipe] = useState(null)
  const [feedData, setFeedData] = useState([])
  const [activeTab, setActiveTab] = useState("ingredients") // 🔥 선택된 탭 상태 관리
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  // ✅ 로그인 여부를 localStorage에서 확인
  const isLoggedIn = localStorage.getItem("kakaoAuthProcessed") === "true"

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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

        if (isLoggedIn) {
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
    // const bookmarkStatus = localStorage.getItem(`bookmark_${id}`)
    // if (bookmarkStatus !== null) {
    //   setIsBookmarked(bookmarkStatus === "true") // "true"이면 true, 아니면 false
    // }

    fetchRecipe()
  }, [id, navigate, user])

  const fetchFeedData = async () => {
    try {
      const response = await axios.get(`https://i12e107.p.ssafy.io/api/feed/read/inRecipe/${id}`)
      console.log("불러온 Feed 데이터:", response.data) // 🔥 API 응답 데이터 확인
      setFeedData(response.data)
    } catch (error) {
      console.error("Feed 데이터를 불러오는 중 오류 발생:", error)
    }
  }

  useEffect(() => {
    if (activeTab === "feed") {
      fetchFeedData() // ✅ Feed 탭이 활성화될 때만 호출
    }
  }, [activeTab, id]) // ✅ id도 의존성에 추가 (레시피가 변경될 수도 있음)

  if (!recipe) {
    return <div>Loading...</div>
  }

  // ✅ 탭을 클릭하면 해당 탭만 보이도록 설정
  const handleTabClick = (tab) => {
    setActiveTab(tab)
  }

  const handleBookmarkClick = async () => {
    console.log("로그인 상태",isLoggedIn)
    if (!isLoggedIn) {
      console.log("로그인이 안되어있음")
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
      // localStorage.setItem(`bookmark_${id}`, newBookmarkStatus.toString()) // 로컬 스토리지에 북마크 상태 저장
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

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown)
  }

  // 페이지 맨 위로 스크롤하는 함수
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="base-div">
      <Logo />

      <div className="card-div">
        <div className="recipe-detail-container">
          <div className="recipe-back-edit-delete">
            <button onClick={() => navigate(-1)} className="recipe-detail-back-button">
              <FontAwesomeIcon className="chevron-left-back-button" icon={faChevronLeft} size="3x" style={{ color: "#F7B05B" }} />
            </button>
            {/* <button onClick={() => navigate(-1)} className="back-button">
              <img src="/images/previous_button.png" alt="Previous" className="icon" />
            </button> */}
            {user && user.nickname === recipe.nickname && (
              <div className="edit-container">
                <button className="edit-button1" onClick={toggleDropdown}>
                  <img src="/images/etc-btn.png" alt="Edit Options1" />
                </button>
                {showDropdown && (
                  <div className="dropdown-menu">
                    <button className="dropdown-item" onClick={handleEditClick}>
                      레시피 수정
                    </button>
                    <button className="dropdown-item" onClick={handleDeleteClick}>
                      레시피 삭제
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="recipe-detail-header">
            <div className="recipe-detail-header-left">
              <div className="recipe-detail-main-images">
                <img src={recipe.image} alt="Recipe" className="recipe-detail-main-image" />
                <div className="hit-eye-icon-area">
                  <img src="/images/hit-eye.png" alt="조회수" className="hit-eye-icon" />
                  <div className="recipe-detail-hits">{recipe.hits}</div>
                </div>
              </div>
            </div>

            <div className="recipe-detail-header-right">
              <div className="recipe-detail-title-container">
                <div className="recipe-detail-title">{recipe.recipeTitle}</div>
                <button className="bookmark-icon-btn" onClick={handleBookmarkClick}>
                  <img src={isBookmarked ? "/images/do-Bookmark.png" : "/images/undo-Bookmark.png"} alt="Bookmark Icon" className="bookmark-icon" />
                </button>
              </div>
              <div className="recipe-detail-info-container">
                <div className="recipe-detail-info-item">
                  <img src="/images/serving.png" alt="Serving" className="recipe-detail-info-icon" />
                  <div className="recipe-detail-info-text">{recipe.serving}</div>
                </div>
                <div className="recipe-detail-info-item">
                  <img src="/images/level.png" alt="Level" className="recipe-detail-info-icon" />
                  <div className="recipe-detail-info-text">{getLevelText(recipe.level)}</div>
                </div>
                <div className="recipe-detail-info-item">
                  <img src="/images/timerequired.png" alt="Time Required" className="recipe-detail-info-icon" />
                  <div className="recipe-detail-info-text">{recipe.requiredTime}</div>
                </div>
              </div>

              <div className="recipe-detail-info-end">
                <div className="recipe-detail-user-info">
                  <img src={recipe.userImage || "/images/default_profile.png"} alt="Profile" className="recipe-detail-profile-image" onClick={() => navigate(`/profile/${recipe.nickname}`)} />
                  <div className="recipe-detail-nickname">{recipe.nickname}</div>
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
                  요리시작
                </button>
              </div>
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

        {/* 페이지 맨 위로 올라가는 버튼 */}
        <div className="recipe-detail-page-scroll-to-top-div" onClick={scrollToTop}>
          <FontAwesomeIcon icon={faChevronUp} size="lg" />
          <span className="recipe-detail-page-top-text">TOP</span>
        </div>

        {/* 🔹 탭 버튼 */}
        <div className="recipe-tabs">
          <button className={activeTab === "ingredients" ? "active" : ""} onClick={() => handleTabClick("ingredients")}>
            재료
          </button>
          <button className={activeTab === "steps" ? "active" : ""} onClick={() => handleTabClick("steps")}>
            조리순서
          </button>
          <button className={activeTab === "feed" ? "active" : ""} onClick={() => handleTabClick("feed")}>
            피드
          </button>
        </div>

        {/* 🔹 탭 컨텐츠 */}
        {activeTab === "ingredients" && (
          <div className="ingredients-section">
            <div className="ingredient-list">
              {recipe.ingredients
                .filter((_, index) => index % 2 === 0) // ✅ 짝수 번째 인덱스만 필터링
                .map((ingredient, index) => (
                  <Fragment key={index}>
                    {" "}
                    {/* ✅ key 추가 */}
                    {/* 왼쪽 아이템 */}
                    <div key={`left-${ingredient.ingreName}`} className="ingredient-item left">
                      <span className="ingredient-name">{ingredient.ingreName}</span>
                      <span>{ingredient.amount}</span>
                    </div>
                    {/* 구분선 */}
                    <div key={`separator-${ingredient.ingreName}`} className="ingredient-separator"></div>
                    {/* 오른쪽 아이템이 존재하는 경우만 렌더링 */}
                    {recipe.ingredients[index * 2 + 1] && (
                      <div key={`right-${recipe.ingredients[index * 2 + 1].ingreName}`} className="ingredient-item right">
                        <span className="ingredient-name">{recipe.ingredients[index * 2 + 1].ingreName}</span>
                        <span>{recipe.ingredients[index * 2 + 1].amount}</span>
                      </div>
                    )}
                  </Fragment>
                ))}
            </div>
          </div>
        )}

        {activeTab === "steps" && (
          <div className="step-section">
            <div className="step-list">
              {recipe.processes.map((process, index) => (
                <div key={index} className="process-item">
                  <div className="process-description">
                    {process.processOrder}. {process.processExplain}
                  </div>
                  {process.images && process.images.map((image, imgIndex) => <img key={imgIndex} src={image.imageUrl} alt={`Process ${process.processOrder}`} className="process-image" />)}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "feed" && (
          <div className="feed-section">
            {feedData.length > 0 ? (
              <div className="feed-list">
                {feedData.map((feed) => (
                  <div key={`feed-${feed.id}`} className="feed-item">
                    <img src={feed.image} alt="Feed" className="feed-image" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="recipe-detail-no-feed">관련된 피드가 없습니다.</div>
            )}
          </div>
        )}

        {/* 🔹 페이지 맨 위로 스크롤 버튼 */}
        <div className="recipe-detail-page-scroll-to-top-div" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <FontAwesomeIcon icon={faChevronUp} size="lg" />
          <span className="recipe-detail-page-top-text">TOP</span>
        </div>
      </div>
    </div>
  )
}

export default RecipeDetailPage
