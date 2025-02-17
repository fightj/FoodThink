import React, { useState, useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "../../styles/recipe/RecipesMainPage.css"
import SearchBarRecipeMain from "../../components/base/SearchBarRecipeMain"
import AnniversaryApiModal from "../../components/anniversary/anniversaryApiModal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronUp } from "@fortawesome/free-solid-svg-icons"

const RecipesMainPage = () => {
  const navigate = useNavigate()
  const [top20Recipes, setTop20Recipes] = useState([])
  const [allRecipes, setAllRecipes] = useState([])
  const [cateType, setCateType] = useState("")
  const [cateMainIngre, setCateMainIngre] = useState("")
  const [sortType, setSortType] = useState("조회순")
  const [isCategoryListVisible, setIsCategoryListVisible] = useState(true)
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(20) // 한 페이지에 20개의 레시피
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true) // 추가
  const [totalResults, setTotalResults] = useState(0) // 총 레시피 개수
  const observer = useRef()
  const carouselRef1 = useRef(null)
  const carouselRef2 = useRef(null)

  const categoryList = {
    종류별: ["반찬", "국/탕", "찌개", "디저트", "면/만두", "밥/죽/떡", "김치/젓갈/장류", "양념/소스/쨈", "양식", "샐러드", "차/음료/술", "기타"],
    재료별: ["소고기", "돼지고기", "닭고기", "육류", "채소류", "해물류", "달걀/유제품", "가공식품", "쌀", "밀가루", "건어물류", "버섯류", "과일류", "콩/견과류", "곡류", "기타"],
  }

  useEffect(() => {
    const fetchTop20Recipes = async () => {
      try {
        const response = await axios.get("https://i12e107.p.ssafy.io/api/recipes/read/recipeList/top20/hits")
        setTop20Recipes(response.data)
      } catch (error) {
        console.error("Error fetching the top 20 recipes", error)
        setTop20Recipes([])
      }
    }

    fetchTop20Recipes()
  }, [])

  const fetchAllRecipes = async (cateType, cateMainIngre, sortType, page, size) => {
    setLoading(true)
    try {
      const response = await axios.get(`https://i12e107.p.ssafy.io/api/recipes/read/recipeList?cateType=${cateType}&cateMainIngre=${cateMainIngre}&sortType=${sortType}&page=${page}&size=${size}`)
      setAllRecipes((prev) => (page === 0 ? response.data.recipes : [...prev, ...response.data.recipes]))
      setTotalResults(response.data.totalElements) // 총 레시피 개수 설정
      setHasMore(response.data.recipes.length > 0) // 추가
    } catch (error) {
      console.error("Error fetching all recipes", error)
      setAllRecipes([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllRecipes(cateType, cateMainIngre, sortType, 0, size)
  }, [cateType, cateMainIngre, sortType])

  const handleDetailClick = (id) => {
    navigate(`/recipes/${id}`)
  }

  const handleSearch = (query) => {
    navigate(`/search?query=${query}`)
  }

  const handleCategoryClick = (category, type) => {
    let newCateType = cateType
    let newCateMainIngre = cateMainIngre

    if (type === "cateType") {
      newCateType = cateType === category ? "" : category
      setCateType(newCateType)
    } else if (type === "cateMainIngre") {
      newCateMainIngre = cateMainIngre === category ? "" : category
      setCateMainIngre(newCateMainIngre)
    }

    setPage(0)
    setAllRecipes([])
    fetchAllRecipes(newCateType, newCateMainIngre, sortType, 0, size)
  }

  const handleSortClick = (sortOption) => {
    setSortType(sortOption)
    setPage(0)
    setAllRecipes([])
    fetchAllRecipes(cateType, cateMainIngre, sortOption, 0, size)
  }

  const lastRecipeElementRef = useCallback(
    (node) => {
      if (loading || !hasMore) return // 추가
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1)
        }
      })
      if (node) observer.current.observe(node)
    },
    [loading, hasMore] // 추가
  )

  useEffect(() => {
    if (page > 0) {
      fetchAllRecipes(cateType, cateMainIngre, sortType, page, size)
    }
  }, [page])

  useEffect(() => {
    const handleScroll = (ref) => {
      const scrollContainer = ref.current
      if (scrollContainer) {
        const scrollPosition = scrollContainer.scrollLeft
        const scrollWidth = scrollContainer.scrollWidth - scrollContainer.clientWidth

        const scrollPercentage = (scrollPosition / scrollWidth) * 100
        scrollContainer.style.setProperty("--scroll-percentage", scrollPercentage)
      }
    }

    const onScroll1 = () => handleScroll(carouselRef1)
    const onScroll2 = () => handleScroll(carouselRef2)

    const scrollContainer1 = carouselRef1.current
    const scrollContainer2 = carouselRef2.current

    if (scrollContainer1) {
      scrollContainer1.addEventListener("scroll", onScroll1)
    }
    if (scrollContainer2) {
      scrollContainer2.addEventListener("scroll", onScroll2)
    }

    return () => {
      if (scrollContainer1) {
        scrollContainer1.removeEventListener("scroll", onScroll1)
      }
      if (scrollContainer2) {
        scrollContainer2.removeEventListener("scroll", onScroll2)
      }
    }
  }, [])

  // 페이지 맨 위로 스크롤하는 함수
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth"})
  }

  return (
    <div className="base-div">
      <AnniversaryApiModal />
      <SearchBarRecipeMain onSearch={handleSearch} />
      <div className="card-div">
        <div className="recipe-page-header">
          <button className="category-onoff-button" onClick={() => setIsCategoryListVisible(prev => !prev)}>
            {isCategoryListVisible ? "카테고리 닫기 ⩓" : "카테고리 열기 ⩔"}
          </button>
          <button href="/recipes/write" className="new-write-button" onClick={() => navigate("/recipes/write")}>
            <img src="/images/feed_write_button.png" alt="Recipe 작성" className="icon" />
          </button>
        </div>

        {/* motion.div로 감싸서 슬라이드 애니메이션 적용 */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={isCategoryListVisible ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="categories2"
        >
          <div className="category-group2">
            <div className="category-title">종류별</div>
            <div className="category-items2">
              {categoryList.종류별.map((category) => (
                <span key={category} className={`category-item2 ${cateType === category ? "selected" : ""}`} onClick={() => handleCategoryClick(category, "cateType")}>
                  {category}
                </span>
              ))}
            </div>
          </div>
          <div className="category-group2">
            <div className="category-title">재료별</div>
            <div className="category-items2">
              {categoryList.재료별.map((category) => (
                <span key={category} className={`category-item2 ${cateMainIngre === category ? "selected" : ""}`} onClick={() => handleCategoryClick(category, "cateMainIngre")}>
                  {category}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {!cateType && !cateMainIngre && (
          <div className="filters2">
            <div className="carousel-wrapper2">
              <div className="popular-recipe">인기 레시피</div>
              <div className="carousel2" ref={carouselRef1}>
                {top20Recipes.map((recipe, index) => (
                  <div key={recipe.recipeId} className="popular-card" onClick={() => handleDetailClick(recipe.recipeId)}>
                    <div className="popular-card-container">
                      <img src={recipe.image} alt={recipe.recipeTitle} className="popular-card-image" />
                      {/* 🏅 첫 번째, 두 번째, 세 번째 카드에 메달 아이콘 추가 */}
                      {index < 3 && (
                        <div className="popular-medal">
                          <img
                            src={index === 0 ? "/images/gold-medal.png" : index === 1 ? "/images/silver-medal.png" : "/images/bronze-medal.png"}
                            alt={`${index + 1}등 메달`}
                            className="popular-medal-icon"
                          />
                        </div>
                      )}
                      {/* 조회수 아이콘 */}
                      <div className="popular-hit-eye-icon-area">
                        <img src="/images/hit-eye.png" alt="" className="popular-hit-eye-icon" />
                        <div className="popular-hit-eye-count">{recipe.hits}</div>
                      </div>
                    </div>
                    <div className="popular-card-info">{recipe.recipeTitle}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div>
          <div className="main-sort-filters">
            <span className={`main-sort-filter ${sortType === "조회순" ? "selected" : ""}`} onClick={() => handleSortClick("조회순")}>
              조회순
            </span>
            <span className={`main-sort-filter ${sortType === "최신순" ? "selected" : ""}`} onClick={() => handleSortClick("최신순")}>
              최신순
            </span>
            <span className={`main-sort-filter ${sortType === "북마크순" ? "selected" : ""}`} onClick={() => handleSortClick("북마크순")}>
              북마크순
            </span>
          </div>
          <div className="main-recipe-list">
            {allRecipes.map((recipe, index) => (
              <div
                key={`${recipe.recipeId}-${index}`}
                ref={allRecipes.length === index + 1 ? lastRecipeElementRef : null}
                className="main-recipe-card"
                onClick={() => handleDetailClick(recipe.recipeId)}
              >
                <img src={recipe.image} alt={recipe.recipeTitle} className="main-recipe-image" />
                <div className="main-recipe-info">
                  <img src={recipe.userImage || "/images/default_profile.png"} alt={`${recipe.nickname} 프로필`} className="main-profile-image" />
                  <div className="main-profile-info">
                    <div className="main-recipe-info-title">{recipe.recipeTitle}</div>
                      <div className="main-profile-stats">{recipe.nickname}</div>
                      <div className="main-profile-stats">
                        👁 {recipe.hits} ·
                        <img src="/images/do-Bookmark.png" alt="북마크 아이콘" className="main-page-bookmark-icon" />
                        {recipe.bookMarkCount}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="main-recipe-text-container">
            {loading && <div className="main-recipe-text">로딩 중...</div>}
            {allRecipes.length === 0 && !loading && <div className="main-recipe-text">레시피가 없습니다.</div>}

            </div>
          </div>
        </div>
      </div>
      {/* 페이지 맨 위로 올라가는 버튼 */}
      <div className="recipe-main-page-scroll-to-top-div" onClick={scrollToTop}>
        <FontAwesomeIcon icon={faChevronUp} size="lg" />
        <span className="recipe-main-page-top-text">TOP</span>
      </div>
    </div>
    // </div>
  )
}

export default RecipesMainPage
