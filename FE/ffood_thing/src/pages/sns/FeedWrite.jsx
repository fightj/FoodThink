import React, { useState, useRef, useEffect, useContext } from "react"
import axios from "axios"
import imageIcon from "../../assets/image.svg"
import { Form, Badge } from "react-bootstrap"
import { useNavigate, useLocation } from "react-router-dom"
import Swal from "sweetalert2"
import "../../styles/sns/FeedWrite.css"
import UserBookmarkRecipe from "../../components/sns/UserBookmarkRecipe"
import { UserContext } from "../../contexts/UserContext"
import "../../styles/base/global.css" // 텍스트 문제
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronLeft} from '@fortawesome/free-solid-svg-icons'

function FeedWrite() {
  const navigate = useNavigate()
  const location = useLocation()

  const [selectedImages, setSelectedImages] = useState([])
  const [checkedImages, setCheckedImages] = useState([])
  const [foodName, setFoodName] = useState("")
  const [description, setDescription] = useState("")
  const [showBookmarkModal, setShowBookmarkModal] = useState(false)
  const [bookmarkData, setBookmarkData] = useState([])
  const [selectedRecipeId, setSelectedRecipeId] = useState(location.state?.recipeId || null)
  const [recipeTitle, setRecipeTitle] = useState(location.state?.recipeTitle || "")
  const fileInputRef = useRef()
  const { user } = useContext(UserContext)

  useEffect(() => {
    if (user) {
      console.log("Current User Info in feed-write-page:", user)
    }

    const userSession = JSON.parse(sessionStorage.getItem("user"))
    const sessionUserId = userSession ? userSession.userId : null

    const fetchBookmarkData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken")
        if (!accessToken) throw new Error("Access token is missing")

        const response = await axios.get("https://i12e107.p.ssafy.io/api/bookmark/read/list", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        console.log("Bookmark Data:", response.data)
        setBookmarkData(response.data)
      } catch (error) {
        console.error("Error fetching bookmark data:", error)
      }
    }

    if (sessionUserId) fetchBookmarkData()

    const savedFoodName = localStorage.getItem("foodName")
    const savedDescription = localStorage.getItem("description")
    const savedImages = localStorage.getItem("selectedImages")
    const savedCheckedImages = localStorage.getItem("checkedImages")
    const savedSelectedRecipeId = localStorage.getItem("selectedRecipeId")
    const savedRecipeTitle = localStorage.getItem("recipeTitle")

    if (savedFoodName || savedDescription || savedImages || savedCheckedImages || savedSelectedRecipeId || savedRecipeTitle) {
      Swal.fire({
        title: "이전에 저장한 임시 데이터가 있습니다. 불러올까요?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "불러오기",
        denyButtonText: `불러오지 않기`,
        customClass: { popup: "custom-swal-popup" },
      }).then((result) => {
        if (result.isConfirmed) {
          if (savedFoodName) setFoodName(savedFoodName)
          if (savedDescription) setDescription(savedDescription)
          if (savedImages) setSelectedImages(JSON.parse(savedImages))
          if (savedCheckedImages) setCheckedImages(JSON.parse(savedCheckedImages))
          if (savedSelectedRecipeId) {
            setSelectedRecipeId(JSON.parse(savedSelectedRecipeId))
          }
          if (savedRecipeTitle) setRecipeTitle(savedRecipeTitle)
          Swal.fire({ title: "불러오기 완료!", text: "", icon: "success", customClass: { popup: "custom-swal-popup" } })
        } else if (result.isDenied) {
          localStorage.removeItem("foodName")
          localStorage.removeItem("description")
          localStorage.removeItem("selectedImages")
          localStorage.removeItem("checkedImages")
          localStorage.removeItem("selectedRecipeId")
          localStorage.removeItem("recipeTitle")
          Swal.fire({ title: "임시 저장 데이터를 삭제했습니다.", text: "", icon: "info", customClass: { popup: "custom-swal-popup" } })
        }
      })
    }

    // capturedImage가 존재할 경우 selectedImages에 추가
    const { capturedImage } = location.state || {}
    if (capturedImage) {
      setSelectedImages((prev) => [...prev, { id: Date.now().toString(), dataURL: capturedImage, isCaptured: true }])
    }
  }, [])

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    const previews = files.map((file) => ({
      id: URL.createObjectURL(file),
      file,
    }))
    setSelectedImages((prev) => [...prev, ...previews])
  }

  const handleCheck = (id) => {
    setCheckedImages((prev) => (prev.includes(id) ? prev.filter((imgId) => imgId !== id) : [...prev, id]))
  }

  const temporarySave = () => {
    localStorage.setItem("selectedImages", JSON.stringify(selectedImages))
    localStorage.setItem("checkedImages", JSON.stringify(checkedImages))
    localStorage.setItem("foodName", foodName)
    localStorage.setItem("description", description)
    localStorage.setItem("selectedRecipeId", JSON.stringify(selectedRecipeId))
    localStorage.setItem("recipeTitle", recipeTitle)
    console.log("임시저장 완료")
  }

  const handleBack = () => {
    Swal.fire({
      title: "변경사항을 임시저장하고 나갈까요?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "임시저장",
      denyButtonText: `임시저장하지 않기`,
      customClass: { popup: "custom-swal-popup" },
    }).then((result) => {
      if (result.isConfirmed) {
        temporarySave()
        Swal.fire({ title: "임시저장!", text: "", icon: "success", customClass: { popup: "custom-swal-popup" } }).then(() => navigate(-1))
      } else if (result.isDenied) {
        Swal.fire({ title: "임시 저장하지 않기", text: "", icon: "info", customClass: { popup: "custom-swal-popup" } }).then(() => navigate(-1))
      }
    })
  }

  const handleBookmarkSelect = async (recipeId) => {
    setSelectedRecipeId(recipeId)

    try {
      const response = await axios.get(`https://i12e107.p.ssafy.io/api/recipes/read/detail/${recipeId}`)
      const { recipeTitle } = response.data
      setRecipeTitle(recipeTitle)
    } catch (error) {
      console.error("Error fetching recipe details:", error)
      Swal.fire({ title: "오류 발생!", text: "레시피 정보를 가져오는 중 오류가 발생했습니다.", icon: "error", customClass: { popup: "custom-swal-popup" } })
    }
  }

  const handleRecipeRemove = () => {
    setSelectedRecipeId(null)
    setRecipeTitle("")
  }

  const addImagesToFormData = async (imagesToUpload, formData) => {
    for (const img of imagesToUpload) {
      if (img.isCaptured) {
        // 캡처된 이미지를 Blob 형태로 변환하여 추가
        const blob = await (await fetch(img.dataURL)).blob()
        formData.append("images", blob, `${img.id}.png`)
      } else {
        formData.append("images", img.file, img.file.name)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (selectedImages.length === 0) {
      Swal.fire({ title: "사진은 필수항목입니다", text: "", icon: "warning", customClass: { popup: "custom-swal-popup" } })
      return
    }

    if (foodName.trim() === "") {
      Swal.fire({ title: "제목은 필수 항목입니다", text: "", icon: "warning", customClass: { popup: "custom-swal-popup" } })
      return
    }

    const imagesToUpload = selectedImages.filter((img) => checkedImages.includes(img.id))
    console.log("업로드할 이미지:", imagesToUpload)
    const accessToken = localStorage.getItem("accessToken")
    console.log(accessToken)

    const formData = new FormData()
    await addImagesToFormData(imagesToUpload, formData)

    const feedRequestDto = {
      foodName: foodName,
      content: description,
      userId: JSON.parse(sessionStorage.getItem("user")).userId,
      recipeId: selectedRecipeId,
    }
    formData.append("feedRequestDto", new Blob([JSON.stringify(feedRequestDto)], { type: "application/json" }))

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success me-2",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    })

    swalWithBootstrapButtons
      .fire({
        title: "정말 작성을 완료할까요?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "작성완료!",
        cancelButtonText: "취소!",
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            if (!accessToken) throw new Error("Access token is missing")

            await axios.post("https://i12e107.p.ssafy.io/api/feed/create", formData, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "multipart/form-data",
              },
            })

            localStorage.removeItem("selectedImages")
            localStorage.removeItem("checkedImages")
            localStorage.removeItem("foodName")
            localStorage.removeItem("description")
            localStorage.removeItem("selectedRecipeId")
            localStorage.removeItem("recipeTitle") // 레시피 타이틀 제거
            swalWithBootstrapButtons
              .fire({
                title: "작성완료!",
                text: "성공적으로 피드가 작성됐어요.",

                icon: "success",
              })
              .then(() => navigate("/sns")) // 피드 전체 목록 페이지로 리디렉트
          } catch (error) {
            console.error("Error uploading images:", error)
            swalWithBootstrapButtons.fire({
              title: "오류 발생!",
              text: "이미지 업로드 중 오류가 발생했습니다.",
              icon: "error",
            })
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: "작성 취소!",
            text: "작성을 취소했어요.",
            icon: "error",
          })
        }
      })
  }

  return (
    <div className="base-div">
      <div className="card-div">
        <div className="sns-write-header">
          <button onClick={handleBack} className="back-button1">
              <FontAwesomeIcon className="chevron-left-back-button"icon={faChevronLeft} size="3x" style={{color: "#F7B05B",}} />
          </button>
          <div className="sns-write-title">
            <h2 className="sns-write-title-h2">피드 작성하기</h2>
            <img src="/images/시원이.png" className="sns-write-title-icon" />
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="preview-container">
            {selectedImages.map((image) => (
              <div key={image.id} className="preview-image">
                <div className="square">
                  <img src={image.isCaptured ? image.dataURL : image.id} alt="미리보기" />
                  {/* <img src={image.id} alt="미리보기" /> */}
                </div>
                <input type="checkbox" className="checkbox" onChange={() => handleCheck(image.id)} checked={checkedImages.includes(image.id)} />
              </div>
            ))}
          </div>

          <div className="file-upload" onClick={() => fileInputRef.current.click()}>
            <img src={imageIcon} alt="이미지 아이콘" />
            <p>이미지 선택</p>
            <input type="file" ref={fileInputRef} id="imageUpload" name="imageUpload" accept="image/*" multiple style={{ display: "none" }} onChange={handleImageChange} />
          </div>

          <hr className="featurette-divider" />

          <h5 className="context-h5">음식명</h5>
          <Form.Control className="feed-wirte-text" type="text" placeholder="예) 김치찌개, 오므라이스, ..." value={foodName} onChange={(e) => setFoodName(e.target.value)} />
          <br />
          <h5 className="context-h5">한줄평</h5>
          <Form.Control className="feed-wirte-text" type="text" placeholder="내용을 작성해주세요." value={description} onChange={(e) => setDescription(e.target.value)} />

          <div className="reference-recipe">
            <h5 className="context-h5">참고한 레시피</h5>
            {recipeTitle && (
              <div className="recipe-badge" style={{ display: "flex", alignItems: "center" }}>
                <Badge className="sns-reference-recipe">
                  {recipeTitle}
                  <span style={{ cursor: "pointer", marginLeft: "0.5em" }} onClick={handleRecipeRemove}>
                    &times;
                  </span>
                </Badge>
              </div>
            )}
            <div className="button-container">
              <button type="button" className="bookmark-find-button" onClick={() => setShowBookmarkModal(true)}>
              🏷️ 내 북마크에서 찾기
              </button>
            </div>
          </div>

          <div className="submit-button">
            <button type="submit" className="feed-save-button">
            ⭐ 저장
            </button>
          </div>
        </form>
      </div>

      {showBookmarkModal && <UserBookmarkRecipe closeModal={() => setShowBookmarkModal(false)} bookmarks={bookmarkData} onBookmarkSelect={handleBookmarkSelect} />}
    </div>
  )
}

export default FeedWrite


