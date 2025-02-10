import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { TouchBackend } from "react-dnd-touch-backend"
import "../../styles/recipe/RecipeWritePage.css"

const ItemType = "STEP"

function Step({ step, index, moveStep, updateStepText, handleStepImageUpload, removeStepImage, removeStep }) {
  const ref = React.useRef(null)
  const [, drop] = useDrop({
    accept: ItemType,
    hover(item, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) {
        return
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = clientOffset.y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      moveStep(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { type: ItemType, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  drag(drop(ref))

  return (
    <div ref={ref} className="step-input-group" style={{ opacity: isDragging ? 0.5 : 1 }}>
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
      <button ref={drag} type="button" className="btn btn-outline-secondary drag-handle">
        ⇅
      </button>
      <button type="button" className="btn btn-outline-danger" onClick={() => removeStep(index)}>
        ❌
      </button>
    </div>
  )
}

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
    setSteps((prevSteps) => prevSteps.filter((_, i) => i !== index).map((step, i) => ({ ...step, processOrder: i + 1 })))
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

  const moveStep = (dragIndex, hoverIndex) => {
    const draggedStep = steps[dragIndex]
    const updatedSteps = [...steps]
    updatedSteps.splice(dragIndex, 1)
    updatedSteps.splice(hoverIndex, 0, draggedStep)

    setSteps(updatedSteps.map((step, i) => ({ ...step, processOrder: i + 1 })))
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
        return 1
    }
  }

  // 필수 입력값 체크 함수
  const validateForm = () => {
    const missingFields = []

    if (!recipeTitle.trim()) missingFields.push("레시피 제목")
    if (!recipeDescription.trim()) missingFields.push("요리 소개")
    if (!category) missingFields.push("카테고리")
    if (!mainIngredient) missingFields.push("메인 재료")
    if (!servings) missingFields.push("인분")
    if (!cookingTime) missingFields.push("요리 시간")
    if (!difficulty) missingFields.push("난이도")

    ingredients.forEach((ingredient, index) => {
      if (!ingredient.name.trim() || !ingredient.amount.trim()) missingFields.push(`재료 ${index + 1}`)
    })

    steps.forEach((step, index) => {
      if (!step.processExplain.trim()) missingFields.push(`요리 순서 ${index + 1}`)
    })

    return missingFields
  }

  // 저장 & 저장 후 공개 API 요청
  const saveRecipe = async (isPublic) => {
    const missingFields = validateForm()

    if (missingFields.length > 0) {
      Swal.fire({
        title: "입력 필요!",
        text: `다음 항목을 입력해 주세요: ${missingFields.join(", ")}`,
        icon: "warning",
      })
      return
    }

    const token = localStorage.getItem("accessToken")
    const formData = new FormData()

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

    if (imageFile) {
      formData.append("imageFile", imageFile)
    }

    const processOrders = []
    steps.forEach((step, index) => {
      if (step.imageFile) {
        formData.append("processImages", step.imageFile)
        processOrders.push(index + 1)
      }
    })

    formData.append("processOrders", new Blob([JSON.stringify(processOrders)], { type: "application/json" }))

    try {
      console.log(formData)
      const response = await fetch("https://i12e107.p.ssafy.io/api/myOwnRecipe/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const responseText = await response.text()
      console.log("📌 [RESPONSE TEXT]:", responseText)

      if (!response.ok) {
        throw new Error(`저장 실패: ${response.status}, 메시지: ${responseText}`)
      }

      Swal.fire({
        title: isPublic ? "레시피 공개 완료!" : "레시피 저장 완료!",
        text: isPublic ? "레시피가 공개 저장되었습니다!" : "레시피가 저장되었습니다.",
        icon: "success",
      }).then(() => {
        navigate(isPublic ? `/recipes/${responseText}` : -1)
      })
    } catch (error) {
      console.error("레시피 저장 중 오류 발생:", error)
      Swal.fire({
        title: "저장 실패!",
        text: "요리 대표 사진을 반드시 설정해주세요.",
        icon: "error",
      })
    }
  }
  const handleSaveDraft = () => {
    const draftRecipe = {
      recipeTitle,
      category,
      mainIngredient,
      servings,
      cookingTime,
      difficulty,
      recipeDescription,
      ingredients,
      steps,
      imageFile,
    }
    localStorage.setItem("draftRecipe", JSON.stringify(draftRecipe))
    Swal.fire({
      title: "임시 저장 완료!",
      text: "작성 중인 레시피가 임시 저장되었습니다.",
      icon: "success",
    })
  }

  // 취소 버튼 핸들러
  const handleCancel = () => {
    Swal.fire({
      title: "작성 취소",
      text: "작성하던 정보가 저장되지 않습니다. 계속하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "네",
      cancelButtonText: "아니요",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(-1)
      }
    })
  }
  // ✅ 페이지 진입 시 로그인 체크
  useEffect(() => {
    const token = localStorage.getItem("accessToken")

    if (!token) {
      alert("로그인이 필요합니다.")
      navigate("/login") // ✅ 로그인 페이지로 이동
    }
  }, [navigate])

  // 임시 저장 기능
  useEffect(() => {
    const savedRecipe = localStorage.getItem("draftRecipe")
    if (savedRecipe) {
      const parsedRecipe = JSON.parse(savedRecipe)
      setRecipeTitle(parsedRecipe.recipeTitle)
      setCategory(parsedRecipe.category)
      setMainIngredient(parsedRecipe.mainIngredient)
      setServings(parsedRecipe.servings)
      setCookingTime(parsedRecipe.cookingTime)
      setDifficulty(parsedRecipe.difficulty)
      setRecipeDescription(parsedRecipe.recipeDescription)
      setIngredients(parsedRecipe.ingredients)
      setSteps(parsedRecipe.steps)
      if (parsedRecipe.imageFile) {
        setImageFile(parsedRecipe.imageFile)
      }
    }
  }, [])

  useEffect(() => {
    const draftRecipe = {
      recipeTitle,
      category,
      mainIngredient,
      servings,
      cookingTime,
      difficulty,
      recipeDescription,
      ingredients,
      steps,
      imageFile,
    }
    localStorage.setItem("draftRecipe", JSON.stringify(draftRecipe))
  }, [recipeTitle, category, mainIngredient, servings, cookingTime, difficulty, recipeDescription, ingredients, steps, imageFile])

  return (
    <DndProvider backend={window.innerWidth < 768 ? TouchBackend : HTML5Backend}>
      <div className="base-div">
        <div className="parent-container">
          <div className="recipe-write-container">
            <div className="recipe-header">
              <button onClick={() => navigate(-1)} className="back-button5">
                <img src="/images/previous_button.png" alt="Previous" className="icon" />
              </button>
              <div className="recipe-title">레시피 등록</div>
            </div>
            <div className="recipe-info-container">
              <div className="recipe-text-section">
                <div className="recipe-title-container">
                  <label className="form-label">레시피 제목</label>
                  <input type="text" className="recipe-title-input" placeholder="예) 연어 포케 만들기" value={recipeTitle} onChange={(e) => setRecipeTitle(e.target.value)} />
                </div>

                <div className="recipe-description-container">
                  <label className="form-label">요리 소개</label>
                  <textarea className="recipe-description" placeholder="이 레시피의 탄생배경을 적어주세요." value={recipeDescription} onChange={(e) => setRecipeDescription(e.target.value)} />
                </div>
              </div>

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
            <div className="steps-container">
              <label className="form-label">요리 순서</label>
              {steps.map((step, index) => (
                <Step
                  key={index}
                  index={index}
                  step={step}
                  moveStep={moveStep}
                  updateStepText={updateStepText}
                  handleStepImageUpload={handleStepImageUpload}
                  removeStepImage={removeStepImage}
                  removeStep={removeStep}
                />
              ))}
              <div className="add-ingredient-btn-wrapper">
                <button type="button" className="btn btn-outline-primary" onClick={addStep}>
                  순서 추가
                </button>
              </div>
            </div>

            <div className="button-group">
              <button type="button" className="btn btn-primary" onClick={() => saveRecipe(false)}>
                저장
              </button>
              <button type="button" className="btn btn-success" onClick={() => saveRecipe(true)}>
                저장 후 공개하기
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={handleSaveDraft}>
                임시 저장
              </button>
              <button type="button" className="btn btn-danger" onClick={handleCancel}>
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  )
}

export default RecipeWritePage
