import React, { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Swal from "sweetalert2"
import axios from "axios"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { TouchBackend } from "react-dnd-touch-backend"

const ItemType = "STEP"

function Step({ step, index, moveStep, updateStepText, handleStepImageUpload, removeStepImage, removeStep }) {
  const ref = React.useRef(null)
  const [, drop] = useDrop({
    accept: ItemType,
    hover(item, monitor) {
      if (!ref.current) return
      const dragIndex = item.index
      const hoverIndex = index
      if (dragIndex === hoverIndex) return

      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = clientOffset.y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return

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
          ) : step.imageUrl ? (
            <>
              <img src={step.imageUrl} alt={`Step ${index + 1}`} className="step-uploaded-image" />
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

function RecipeUpdatePage() {
  const navigate = useNavigate()
  const { id: recipeId } = useParams()
  const [isLoading, setIsLoading] = useState(true)

  // 기본 정보 상태
  const [recipeTitle, setRecipeTitle] = useState("")
  const [category, setCategory] = useState("")
  const [mainIngredient, setMainIngredient] = useState("")
  const [servings, setServings] = useState("")
  const [cookingTime, setCookingTime] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [isPublic, setIsPublic] = useState(true)

  // 이미지 관련 상태
  const [imageFile, setImageFile] = useState(null)
  const [previewImageUrl, setPreviewImageUrl] = useState("")

  // 재료와 단계 상태
  const [ingredients, setIngredients] = useState([{ name: "", amount: "" }])
  const [steps, setSteps] = useState([{ processExplain: "", processOrder: 1 }])

  // 난이도 변환 함수들
  const convertNumberToLevel = (level) => {
    switch (level) {
      case 1:
        return "하"
      case 2:
        return "중"
      case 3:
        return "상"
      default:
        return "하"
    }
  }

  const convertLevelToNumber = (level) => {
    switch (level) {
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

  // 초기 데이터 로드
  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (!token) {
      Swal.fire({
        title: "로그인 필요",
        text: "로그인이 필요한 서비스입니다.",
        icon: "warning",
      }).then(() => {
        navigate("/login")
      })
      return
    }

    const fetchRecipeData = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get(`https://i12e107.p.ssafy.io/api/myOwnRecipe/read/modifyRecipe/${recipeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = response.data

        // 기본 정보 설정
        setRecipeTitle(data.recipeTitle)
        setCategory(data.cateType)
        setMainIngredient(data.cateMainIngre)
        setServings(data.serving)
        setCookingTime(data.requiredTime)
        setDifficulty(convertNumberToLevel(data.level))
        setIsPublic(data.isPublic)

        // 이미지 URL 설정
        if (data.image) {
          setPreviewImageUrl(data.image)
        }

        // 재료 설정
        setIngredients(
          data.ingredients.map((ing) => ({
            name: ing.ingreName,
            amount: ing.amount,
          }))
        )

        // 조리 단계 설정 - images 배열 전체를 저장
        setSteps(
          data.processes.map((process) => ({
            processOrder: process.processOrder,
            processExplain: process.processExplain,
            images: process.images, // 이미지 배열 전체 저장
            imageUrl: process.images[0]?.imageUrl || null, // 첫 번째 이미지 URL
            imageFile: null,
          }))
        )
      } catch (error) {
        console.error("레시피 데이터를 불러오는 중 오류 발생:", error)
        Swal.fire({
          title: "오류 발생",
          text: "레시피 데이터를 불러오는데 실패했습니다.",
          icon: "error",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecipeData()
  }, [navigate, recipeId])

  // 이미지 처리 함수들
  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setImageFile(file)
      setPreviewImageUrl(URL.createObjectURL(file))
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setPreviewImageUrl("")
  }

  // 재료 관련 함수들
  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", amount: "" }])
  }

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  // 조리 단계 관련 함수들
  const addStep = () => {
    setSteps((prevSteps) => [
      ...prevSteps,
      {
        processExplain: "",
        imageFile: null,
        imageUrl: null,
        processOrder: prevSteps.length + 1,
      },
    ])
  }

  const removeStep = (index) => {
    setSteps((prevSteps) => prevSteps.filter((_, i) => i !== index).map((step, i) => ({ ...step, processOrder: i + 1 })))
  }

  const handleStepImageUpload = (event, index) => {
    const file = event.target.files[0]
    if (!file) return

    setSteps((prevSteps) => prevSteps.map((step, i) => (i === index ? { ...step, imageFile: file, imageUrl: null } : step)))
  }

  const removeStepImage = (index) => {
    setSteps((prevSteps) => prevSteps.map((step, i) => (i === index ? { ...step, imageFile: null, imageUrl: null } : step)))
  }

  const updateStepText = (index, text) => {
    setSteps((prevSteps) => prevSteps.map((step, i) => (i === index ? { ...step, processExplain: text } : step)))
  }

  const moveStep = (dragIndex, hoverIndex) => {
    const draggedStep = steps[dragIndex]
    const updatedSteps = [...steps]
    updatedSteps.splice(dragIndex, 1)
    updatedSteps.splice(hoverIndex, 0, draggedStep)

    setSteps(
      updatedSteps.map((step, i) => ({
        ...step,
        processOrder: i + 1,
      }))
    )
  }

  // 폼 유효성 검사
  const validateForm = () => {
    const missingFields = []

    if (!recipeTitle?.trim()) missingFields.push("레시피 제목")
    if (!category) missingFields.push("카테고리")
    if (!mainIngredient) missingFields.push("메인 재료")
    if (!servings) missingFields.push("인분")
    if (!cookingTime) missingFields.push("요리 시간")
    if (!difficulty) missingFields.push("난이도")
    if (!previewImageUrl && !imageFile) missingFields.push("요리 대표 사진")

    ingredients.forEach((ingredient, index) => {
      if (!ingredient.name?.trim() || !ingredient.amount?.trim()) {
        missingFields.push(`재료 ${index + 1}`)
      }
    })

    steps.forEach((step, index) => {
      if (!step.processExplain?.trim()) {
        missingFields.push(`요리 순서 ${index + 1}`)
      }
    })

    return missingFields
  }

  // 레시피 수정 제출
  const updateRecipe = async () => {
    const missingFields = validateForm()
    if (missingFields.length > 0) {
      Swal.fire({
        title: "입력 필요",
        text: `다음 항목을 입력해 주세요: ${missingFields.join(", ")}`,
        icon: "warning",
      })
      return
    }

    const token = localStorage.getItem("accessToken")
    const formData = new FormData()

    // API 요청 형식에 맞춘 recipeData
    const recipeData = {
      recipeTitle,
      cateType: category,
      cateMainIngre: mainIngredient,
      serving: servings,
      level: convertLevelToNumber(difficulty),
      requiredTime: cookingTime,
      isPublic,
      ingredients: ingredients.map((ing) => ({
        ingreName: ing.name,
        amount: ing.amount,
      })),
      processes: steps.map((step, idx) => ({
        processOrder: idx + 1,
        processExplain: step.processExplain,
      })),
    }

    // recipe JSON 문자열 생성
    const recipeBlob = new Blob([JSON.stringify(recipeData)], { type: "application/json" })
    formData.append("recipe", recipeBlob)

    // 대표 이미지가 있는지 확인
    if (imageFile) {
      formData.append("imageFile", imageFile)
    } else {
      // imageFile이 없는 경우 빈 파일을 추가
      const emptyFile = new Blob([], { type: "multipart/form-data" })
      formData.append("imageFile", emptyFile, "placeholder.png")
    }

    // 단계별 이미지 및 순서 추가
    const processOrders = []
    steps.forEach((step, idx) => {
      if (step.imageFile) {
        formData.append("processImages", step.imageFile)
        processOrders.push(idx + 1)
      } else if (step.imageUrl) {
        processOrders.push(idx + 1)
      }
    })

    // 기존 이미지를 processOrders에 추가
    const processImages = steps.flatMap((step) => (step.images ? step.images.map((img) => img.imageUrl) : []))
    console.log("processImages:", processImages)

    if (processOrders.length > 0) {
      const processOrdersBlob = new Blob([JSON.stringify(processOrders)], { type: "application/json" })
      formData.append("processOrders", processOrdersBlob)
    }

    if (processImages.length > 0) {
      formData.append("existingImages", JSON.stringify(processImages))
    }

    try {
      console.log("Submitting recipe data:", JSON.stringify(recipeData, null, 2))
      console.log("Submitting process orders:", processOrders)

      const response = await axios.put(`https://i12e107.p.ssafy.io/api/myOwnRecipe/update/${recipeId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.status === 200) {
        Swal.fire({
          title: "수정 완료",
          text: "레시피가 성공적으로 수정되었습니다.",
          icon: "success",
        }).then(() => {
          navigate(`/recipes/${recipeId}`)
        })
      }
    } catch (error) {
      console.error("레시피 수정 중 오류 발생:", error)
      if (error.response) {
        console.error("Error response:", error.response.data)
      }
      Swal.fire({
        title: "수정 실패",
        text: "레시피 수정 중 오류가 발생했습니다.",
        icon: "error",
      })
    }
  }

  // 취소 처리
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

  if (isLoading) {
    return <div className="loading">로딩 중...</div>
  }

  return (
    <DndProvider backend={window.innerWidth < 768 ? TouchBackend : HTML5Backend}>
      <div className="base-div">
        <div className="parent-container">
          <div className="recipe-write-container">
            <div className="recipe-header">
              <button onClick={() => navigate(-1)} className="back-button5">
                <img src="/images/previous_button.png" alt="Previous" className="icon" />
              </button>
              <div className="recipe-title">레시피 수정</div>
            </div>
            <div className="recipe-info-container">
              <div className="recipe-text-section">
                <div className="recipe-title-container">
                  <label className="form-label">레시피 제목</label>
                  <input type="text" className="recipe-title-input" placeholder="예) 연어 포케 만들기" value={recipeTitle} onChange={(e) => setRecipeTitle(e.target.value)} />
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
              <button type="button" className="btn btn-primary" onClick={() => updateRecipe(false)}>
                수정
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

export default RecipeUpdatePage
