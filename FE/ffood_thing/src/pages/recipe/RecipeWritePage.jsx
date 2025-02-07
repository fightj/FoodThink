import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../../styles/recipe/RecipeWritePage.css"

function RecipeWritePage() {
  const navigate = useNavigate()
  const [ingredients, setIngredients] = useState([{ name: "", amount: "" }])
  const [steps, setSteps] = useState([{ processExplain: "", processOrder: 1, imageFile: null }])
  const [imageFile, setImageFile] = useState(null)
  const [category, setCategory] = useState("")
  const [mainIngredient, setMainIngredient] = useState("")
  const [servings, setServings] = useState("")
  const [cookingTime, setCookingTime] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [recipeTitle, setRecipeTitle] = useState("")
  const [recipeDescription, setRecipeDescription] = useState("")

  // 대표 사진 업로드
  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) setImageFile(file)
  }

  // 대표 사진 삭제
  const removeImage = () => setImageFile(null)

  // 재료 추가
  const addIngredient = () => setIngredients([...ingredients, { name: "", amount: "" }])

  // 재료 삭제
  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  // 요리 순서 추가
  const addStep = () => {
    setSteps((prevSteps) => [...prevSteps, { processExplain: "", imageFile: null }])
  }

  // 요리 순서 삭제
  const removeStep = (index) => {
    setSteps(
      (prevSteps) => prevSteps.filter((_, i) => i !== index).map((step, i) => ({ ...step, processOrder: i + 1 })) // 순서 재정렬
    )
  }

  // 과정 이미지 업로드
  const handleStepImageUpload = (event, index) => {
    const file = event.target.files[0]
    if (!file) return

    setSteps((prevSteps) => prevSteps.map((step, i) => (i === index ? { ...step, imageFile: file } : step)))
  }

  // 과정 이미지 삭제
  const removeStepImage = (index) => {
    setSteps((prevSteps) => prevSteps.map((step, i) => (i === index ? { ...step, imageFile: null } : step)))
  }

  // 요리 순서 텍스트 업데이트
  const updateStepText = (index, text) => {
    setSteps(steps.map((step, i) => (i === index ? { ...step, processExplain: text } : step)))
  }

  // 난이도 변환 함수 (하 = 1, 중 = 2, 상 = 3)
  const convertDifficultyToNumber = (difficulty) => {
    switch (difficulty) {
      case "하":
        return 1
      case "중":
        return 2
      case "상":
        return 3
      default:
        return 1 // 기본값 (하)
    }
  }

  // 저장 & 저장 후 공개 API 요청
  const saveRecipe = async (isPublic) => {
    // ✅ token 변수를 함수 내부에서 선언
    const token = localStorage.getItem("accessToken")

    if (!token) {
      alert("로그인이 필요합니다.")
      navigate("/login") // 로그인 페이지로 이동
      return
    }
    const formData = new FormData()

    // ✅ 1. JSON 데이터를 문자열로 변환해서 추가 (Blob 사용 X)
    formData.append(
      "recipe",
      new Blob(
        [
          JSON.stringify({
            recipeTitle,
            cateType: category,
            cateMainIngre: mainIngredient,
            serving: servings,
            level: convertDifficultyToNumber(difficulty),
            requiredTime: cookingTime,
            isPublic,
            ingredients: ingredients.map((ingredient) => ({
              ingreName: ingredient.name,
              amount: ingredient.amount,
            })),
            processes: steps.map((step, index) => ({
              processOrder: index + 1,
              processExplain: step.processExplain,
            })),
          }),
        ],
        { type: "application/json" }
      )
    )

    // ✅ 2. 대표 이미지 추가 (multipart/form-data)
    if (imageFile) {
      formData.append("imageFile", imageFile)
    }

    // ✅ 3. 과정 이미지 및 순서 추가 (multipart/form-data)
    const processOrders = []
    steps.forEach((step, index) => {
      if (step.imageFile) {
        formData.append("processImages", step.imageFile)
        processOrders.push(index + 1) // 몇 번째 과정인지 저장
      }
    })

    // ✅ 과정 이미지 순서 배열 추가
    formData.append("processOrders", new Blob([JSON.stringify(processOrders)], { type: "application/json" }))

    try {
      const response = await fetch("https://i12e107.p.ssafy.io/api/myOwnRecipe/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`저장 실패: ${response.status}`)
      }

      alert(isPublic ? "레시피가 공개 저장되었습니다!" : "레시피가 저장되었습니다.")
      navigate(-1)
    } catch (error) {
      console.error("레시피 저장 중 오류 발생:", error)
      alert("저장 중 문제가 발생했습니다.")
    }
  }

  // 취소 버튼 핸들러
  const handleCancel = () => {
    if (window.confirm("작성하던 정보가 저장되지 않습니다. 계속하시겠습니까?")) {
      navigate(-1)
    }
  }

  return (
    <div className="base-div">
      <div className="parent-container">
        <div className="recipe-write-container">
          {/* 레시피 등록 헤더 (제목 + 뒤로가기 버튼) */}
          <div className="recipe-header">
            <button onClick={() => navigate(-1)} className="back-button5">
              <img src="/images/previous_button.png" alt="Previous" className="icon" />
            </button>
            <div className="recipe-title">레시피 등록</div>
          </div>

          {/* 입력 영역 (65% 제목 + 소개) (35% 대표 사진) */}
          <div className="recipe-info-container">
            {/* 왼쪽: 제목 + 소개 */}
            <div className="recipe-text-section">
              {/* 레시피 제목 */}
              <div className="recipe-title-container">
                <label className="form-label">레시피 제목</label>
                <input type="text" className="recipe-title-input" placeholder="예) 연어 포케 만들기" value={recipeTitle} onChange={(e) => setRecipeTitle(e.target.value)} />
              </div>

              {/* 요리 소개 */}
              <div className="recipe-description-container">
                <label className="form-label">요리 소개</label>
                <textarea className="recipe-description" placeholder="이 레시피의 탄생배경을 적어주세요." value={recipeDescription} onChange={(e) => setRecipeDescription(e.target.value)} />
              </div>
            </div>
            {/* 오른쪽: 대표 사진 업로드 */}
            <div className="image-upload-container">
              <input type="file" id="imageUpload" accept="image/*" onChange={handleImageUpload} hidden />
              <label htmlFor="imageUpload" className="image-upload-label">
                {imageFile ? (
                  <>
                    <img src={URL.createObjectURL(imageFile)} alt="요리 대표 이미지" className="uploaded-image" />
                    <button className="remove-image-btn" onClick={removeImage}>
                      ✖
                    </button>
                  </>
                ) : (
                  "요리 대표 사진을 등록해주세요."
                )}
              </label>
            </div>
          </div>

          {/* 📌 카테고리 선택 */}
          <div className="category-container">
            <label className="form-label">카테고리</label>
            <select className="dropdown1" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="" disabled>
                종류별
              </option>
              <option value="반찬">반찬</option>
              <option value="국/탕">국/탕</option>
              <option value="찌개">찌개</option>
              <option value="디저트">디저트</option>
              <option value="면/만두">면/만두</option>
              <option value="밥/죽/떡">밥/죽/떡</option>
              <option value="김치/젓갈/장류">김치/젓갈/장류</option>
              <option value="양념/소스/잼">양념/소스/잼</option>
              <option value="양식">양식</option>
              <option value="샐러드">샐러드</option>
              <option value="차/음료/술">차/음료/술</option>
              <option value="기타">기타</option>
            </select>

            <select className="dropdown1" value={mainIngredient} onChange={(e) => setMainIngredient(e.target.value)}>
              <option value="" disabled>
                메인재료별
              </option>
              <option value="소고기">소고기</option>
              <option value="돼지고기">돼지고기</option>
              <option value="닭고기">닭고기</option>
              <option value="육류">육류</option>
              <option value="채소류">채소류</option>
              <option value="해물류">해물류</option>
              <option value="달걀/유제품">달걀/유제품</option>
              <option value="가공식품">가공식품</option>
              <option value="쌀">쌀</option>
              <option value="밀가루">밀가루</option>
              <option value="건어물류">건어물류</option>
              <option value="버섯류">버섯류</option>
              <option value="과일류">과일류</option>
              <option value="빵/견과류">빵/견과류</option>
              <option value="곡류">곡류</option>
              <option value="기타">기타</option>
            </select>
          </div>

          {/* 📌 요리 정보 선택 */}
          <div className="cooking-info-container">
            <label className="form-label">요리정보</label>
            <select className="dropdown1" value={servings} onChange={(e) => setServings(e.target.value)}>
              <option value="" disabled>
                인분
              </option>
              <option value="1인분">1인분</option>
              <option value="2인분">2인분</option>
              <option value="3인분">3인분</option>
              <option value="4인분">4인분</option>
              <option value="5인분">5인분</option>
              <option value="6인분 이상">6인분 이상</option>
            </select>

            <select className="dropdown1" value={cookingTime} onChange={(e) => setCookingTime(e.target.value)}>
              <option value="" disabled>
                시간
              </option>
              <option value="5분 이내">5분 이내</option>
              <option value="10분 이내">10분 이내</option>
              <option value="15분 이내">15분 이내</option>
              <option value="20분 이내">20분 이내</option>
              <option value="30분 이내">30분 이내</option>
              <option value="60분 이내">60분 이내</option>
              <option value="90분 이내">90분 이내</option>
              <option value="120분 이내">120분 이내</option>
              <option value="2시간 이상">2시간 이상</option>
            </select>

            <select className="dropdown1" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="" disabled>
                난이도
              </option>
              <option value="하">하</option>
              <option value="중">중</option>
              <option value="상">상</option>
            </select>
          </div>

          {/* 📌 재료 입력 */}
          <div className="ingredients-container">
            <label className="form-label">재료정보</label>
            {ingredients.map((ingredient, index) => (
              <div className="ingredient-input-group" key={index}>
                <input
                  type="text"
                  className="text-input small"
                  placeholder="예) 연어"
                  value={ingredient.name}
                  onChange={(e) => {
                    const newIngredients = [...ingredients]
                    newIngredients[index].name = e.target.value
                    setIngredients(newIngredients)
                  }}
                />
                <input
                  type="text"
                  className="text-input small"
                  placeholder="예) 300g"
                  value={ingredient.amount}
                  onChange={(e) => {
                    const newIngredients = [...ingredients]
                    newIngredients[index].amount = e.target.value
                    setIngredients(newIngredients)
                  }}
                />

                <button type="button" className="btn btn-outline-danger" onClick={() => removeIngredient(index)}>
                  ❌
                </button>
              </div>
            ))}
            <div className="add-ingredient-btn-wrapper">
              <button type="button" className="btn btn-outline-primary" onClick={addIngredient}>
                재료 추가
              </button>
            </div>
          </div>

          {/* 📌 요리 순서 입력 */}
          <div className="steps-container">
            <label className="form-label">요리 순서</label>
            {steps.map((step, index) => (
              <div key={index} className="step-input-group">
                <textarea className="text-area small" placeholder={`Step ${index + 1}`} value={step.processExplain} onChange={(e) => updateStepText(index, e.target.value)} />

                <div className="step-image-upload">
                  <input type="file" id={`stepImageUpload-${index}`} accept="image/*" onChange={(e) => handleStepImageUpload(e, index)} hidden />
                  <label htmlFor={`stepImageUpload-${index}`} className="step-image-label">
                    {step.imageFile ? (
                      <>
                        <img src={URL.createObjectURL(step.imageFile)} alt={`Step ${index + 1}`} className="step-uploaded-image" />
                        <button type="button" className="remove-step-image-btn" onClick={() => removeStepImage(index)}>
                          ✖
                        </button>
                      </>
                    ) : (
                      "이미지 추가"
                    )}
                  </label>
                </div>
                <button type="button" className="btn btn-outline-danger" onClick={() => removeStep(index)}>
                  ❌
                </button>
              </div>
            ))}
            <div className="add-ingredient-btn-wrapper">
              <button type="button" className="btn btn-outline-primary" onClick={addStep}>
                순서 추가
              </button>
            </div>
          </div>

          {/* 📌 저장/취소 버튼 */}
          <div className="button-group">
            <button type="button" className="btn btn-primary" onClick={() => saveRecipe(false)}>
              저장
            </button>
            <button type="button" className="btn btn-success" onClick={() => saveRecipe(true)}>
              저장 후 공개하기
            </button>
            <button type="button" className="btn btn-danger" onClick={handleCancel}>
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecipeWritePage
