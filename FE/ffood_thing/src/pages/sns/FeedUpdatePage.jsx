import React, { useState, useRef, useEffect, useContext } from "react"
import axios from "axios"
import imageIcon from "../../assets/image.svg"
import { Form, Badge } from "react-bootstrap"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import Swal from "sweetalert2"
import "../../styles/sns/FeedWrite.css"
import UserBookmarkRecipe from "../../components/sns/UserBookmarkRecipe"
import { UserContext } from "../../contexts/UserContext"
import "../../styles/base/global.css" //텍스트 문제
import "../../styles/sns/FeedDetail.css"

function FeedUpdatePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const [selectedImages, setSelectedImages] = useState([])
  const [checkedImages, setCheckedImages] = useState([])
  const [foodName, setFoodName] = useState("")
  const [description, setDescription] = useState("")
  const [showBookmarkModal, setShowBookmarkModal] = useState(false)
  const [bookmarkData, setBookmarkData] = useState([])
  const [selectedRecipeId, setSelectedRecipeId] = useState(null)
  const [recipeTitle, setRecipeTitle] = useState("")

  const fileInputRef = useRef()

  const { user } = useContext(UserContext)

  const fetchRecipeTitle = async (recipeId) => {
    try {
      const response = await axios.get(`/recipes/read/detail/${recipeId}`)
      const { recipeTitle } = response.data
      setRecipeTitle(recipeTitle)
    } catch (error) {
      console.error("Error fetching recipe details:", error)
      Swal.fire("오류 발생!", "레시피 정보를 가져오는 중 오류가 발생했습니다.", "error")
    }
  }

  useEffect(() => {
    if (location.state) {
      setFoodName(location.state.foodName || "")
      setDescription(location.state.content || "")
      const images = location.state.images || []
      const previews = images.map((image) => ({
        id: image,
      }))
      setSelectedImages(previews)
      setCheckedImages(previews.map((image) => image.id))

      if (location.state.recipeId) {
        setSelectedRecipeId(location.state.recipeId)
        setRecipeTitle(location.state.recipeTitle)
      }
    } else {
      const fetchData = async () => {
        try {
          const response = await axios.get(`/feed/read/id/${id}`)
          const data = response.data

          setFoodName(data.food_name)
          setDescription(data.content)

          const images = data.images.map((image) => ({
            id: image.url,
            file: null,
          }))
          setSelectedImages(images)
          setCheckedImages(images.map((image) => image.id))

          if (data.recipe_id) {
            setSelectedRecipeId(data.recipe_id)
            await fetchRecipeTitle(data.recipe_id)
          }
        } catch (error) {
          console.error("Error fetching feed data:", error)
        }
      }
      fetchData()
    }

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

    fetchBookmarkData()
  }, [id, location.state])

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
    localStorage.setItem(`selectedImages_${id}`, JSON.stringify(selectedImages))
    localStorage.setItem(`checkedImages_${id}`, JSON.stringify(checkedImages))
    localStorage.setItem(`foodName_${id}`, foodName)
    localStorage.setItem(`description_${id}`, description)
    localStorage.setItem(`selectedRecipeId_${id}`, JSON.stringify(selectedRecipeId))
    localStorage.setItem(`recipeTitle_${id}`, recipeTitle)
    console.log("임시저장 완료")
  }

  const handleBack = () => {
    Swal.fire({
      title: "변경사항을 임시저장하고 나갈까요?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "임시저장",
      denyButtonText: `임시저장하지 않기`,
    }).then((result) => {
      if (result.isConfirmed) {
        temporarySave()
        Swal.fire("임시저장!", "", "success").then(() => navigate(-1))
      } else if (result.isDenied) {
        Swal.fire("임시 저장하지 않기", "", "info").then(() => navigate(-1))
      }
    })
  }

  const handleNavigate = (path) => {
    temporarySave()
    navigate(path)
  }

  const handleBookmarkSelect = async (recipeId) => {
    setSelectedRecipeId(recipeId)

    try {
      const response = await axios.get(`https://i12e107.p.ssafy.io/api/recipes/read/detail/${recipeId}`)
      const { recipeTitle } = response.data
      setRecipeTitle(recipeTitle)
    } catch (error) {
      console.error("Error fetching recipe details:", error)
      Swal.fire("오류 발생!", "레시피 정보를 가져오는 중 오류가 발생했습니다.", "error")
    }
  }

  const handleRecipeRemove = () => {
    setSelectedRecipeId(null)
    setRecipeTitle("")
  }

  const urlToFile = async (url, filename, mimeType) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      return new File([blob], filename, { type: mimeType })
    } catch (error) {
      console.error("Error converting URL to File:", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (selectedImages.length === 0) {
      Swal.fire("사진은 필수항목입니다", "", "warning")
      return
    }

    if (foodName.trim() === "") {
      Swal.fire("제목은 필수 항목입니다", "", "warning")
      return
    }

    const accessToken = localStorage.getItem("accessToken")

    const formData = new FormData()

    for (const img of selectedImages) {
      if (img.file) {
        // 새로운 이미지인 경우
        formData.append("images", img.file, img.file.name)
      } else {
        // 기존 이미지인 경우 URL을 이용해 Blob을 생성하고 File 객체로 변환
        const file = await urlToFile(img.id, img.id.split("/").pop(), "image/jpeg")
        formData.append("images", file)
      }
    }

    const feedRequestDto = {
      foodName: foodName,
      content: description,
      userId: JSON.parse(sessionStorage.getItem("user")).userId,
      recipeId: selectedRecipeId,
    }
    console.log(feedRequestDto)
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
        title: "정말 수정을 완료할까요?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "수정완료!",
        cancelButtonText: "취소!",
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axios.put(`https://i12e107.p.ssafy.io/api/feed/update/${id}`, formData, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "multipart/form-data",
              },
            })

            localStorage.removeItem(`selectedImages_${id}`)
            localStorage.removeItem(`checkedImages_${id}`)
            localStorage.removeItem(`foodName_${id}`)
            localStorage.removeItem(`description_${id}`)
            localStorage.removeItem(`selectedRecipeId_${id}`)
            localStorage.removeItem(`recipeTitle_${id}`)
            swalWithBootstrapButtons
              .fire({
                title: "수정완료!",
                text: "성공적으로 피드가 수정됐어요.",
                imageUrl: "/images/mainlogo.jpg",
                imageWidth: 350,
                imageHeight: 300,
                imageAlt: "Custom image",
                icon: "success",
              })
              .then(() => navigate(-1))
          } catch (error) {
            console.error("Error updating feed:", error)
            swalWithBootstrapButtons.fire({
              title: "오류 발생!",
              text: "피드 수정 중 오류가 발생했습니다.",
              icon: "error",
            })
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: "수정 취소!",
            text: "수정을 취소했어요.",
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
            <img src="/images/previous_button.png" alt="Previous" className="back-button-icon" />
          </button>
          <div className="sns-write-title">
              <h2 className="sns-write-title-h2">피드 수정</h2>
              <img src="/images/시원이.png" className="sns-write-title-icon" />
          </div>
        </div>
            
            <form onSubmit={handleSubmit}>
              <div className="preview-container">
                {selectedImages.map((image) => (
                  <div key={image.id} className="preview-image">
                    <div className="square">
                      <img src={image.id} alt="미리보기" />
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
              <Form.Control className="feed-write-text" type="text" value={foodName} onChange={(e) => setFoodName(e.target.value)} />
              <br />
              <h5 className="context-h5">한줄평</h5>
              <Form.Control className="feed-write-text" type="text" value={description} onChange={(e) => setDescription(e.target.value)} />

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
                  <button type="button" className="btn btn-secondary" onClick={() => setShowBookmarkModal(true)}>
                    내 북마크에서 찾기
                  </button>
                </div>
              </div>

              <div className="submit-button">
                <button type="submit" className="btn btn-primary">
                  수정 완료
                </button>
              </div>
            </form>
        </div>

      {showBookmarkModal && <UserBookmarkRecipe closeModal={() => setShowBookmarkModal(false)} bookmarks={bookmarkData} onBookmarkSelect={handleBookmarkSelect} />}
    </div>
  )
}

export default FeedUpdatePage
