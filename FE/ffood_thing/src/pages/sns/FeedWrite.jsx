import React, { useState, useRef, useEffect } from "react"
import axios from "axios"
import imageIcon from "../../assets/image.svg"
import { Form } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import "../../styles/sns/FeedWrite.css"
import UserBookmarkRecipe from "../../components/sns/UserBookmarkRecipe"

function FeedWrite() {
  const navigate = useNavigate()

  const [selectedImages, setSelectedImages] = useState([])
  const [checkedImages, setCheckedImages] = useState([])
  const [foodName, setFoodName] = useState("")
  const [description, setDescription] = useState("")
  const [showBookmarkModal, setShowBookmarkModal] = useState(false)
  const [bookmarkData, setBookmarkData] = useState([]) // 북마크 데이터 상태 추가
  const fileInputRef = useRef()

  useEffect(() => {
    // 세션에서 유저 정보 가져오기
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
        setBookmarkData(response.data) // 북마크 데이터 상태에 저장
      } catch (error) {
        console.error("Error fetching bookmark data:", error)
      }
    }

    if (sessionUserId) {
      fetchBookmarkData()
    }

    // 이전에 저장된 임시 데이터를 불러올지 묻기
    const savedFoodName = localStorage.getItem("foodName")
    const savedDescription = localStorage.getItem("description")
    const savedImages = localStorage.getItem("selectedImages")
    const savedCheckedImages = localStorage.getItem("checkedImages")

    if (savedFoodName || savedDescription || savedImages || savedCheckedImages) {
      Swal.fire({
        title: "이전에 저장한 임시 데이터가 있습니다. 불러올까요?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "불러오기",
        denyButtonText: `불러오지 않기`,
      }).then((result) => {
        if (result.isConfirmed) {
          if (savedFoodName) setFoodName(savedFoodName)
          if (savedDescription) setDescription(savedDescription)
          if (savedImages) setSelectedImages(JSON.parse(savedImages))
          if (savedCheckedImages) setCheckedImages(JSON.parse(savedCheckedImages))
          Swal.fire("불러오기 완료!", "", "success")
        } else if (result.isDenied) {
          localStorage.removeItem("foodName")
          localStorage.removeItem("description")
          localStorage.removeItem("selectedImages")
          localStorage.removeItem("checkedImages")
          Swal.fire("임시 저장 데이터를 삭제했습니다.", "", "info")
        }
      })
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    const imagesToUpload = selectedImages.filter((img) => checkedImages.includes(img.id))
    console.log("업로드할 이미지:", imagesToUpload)

    const formData = new FormData()
    imagesToUpload.forEach((img) => formData.append("images", img.file))
    const feedRequestDto = {
      foodName: foodName,
      content: description,
      userId: JSON.parse(sessionStorage.getItem("user")).userId, // Fetch userId from session storage
      recipeId: 1, // Replace with actual recipe ID
    }
    formData.append("feedRequestDto", new Blob([JSON.stringify(feedRequestDto)], { type: "application/json" }))

    // Log the formData to see what's being sent
    for (let [key, value] of formData.entries()) {
      console.log(key, value)
    }

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
            const accessToken = localStorage.getItem("accessToken")
            if (!accessToken) throw new Error("Access token is missing")

            await axios.post("https://i12e107.p.ssafy.io/api/feed/create", formData, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            })

            // 폼 제출 후 localStorage 비우기
            localStorage.removeItem("selectedImages")
            localStorage.removeItem("checkedImages")
            localStorage.removeItem("foodName")
            localStorage.removeItem("description")
            swalWithBootstrapButtons
              .fire({
                title: "작성완료!",
                text: "성공적으로 피드가 작성됐어요.",
                imageUrl: "/images/mainlogo.jpg",
                imageWidth: 350,
                imageHeight: 300,
                imageAlt: "Custom image",
                icon: "success",
              })
              .then(() => navigate(-1))
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
      <div className="parent-container">
        <div className="card-div-write">
          <div className="div-80">
            <button onClick={handleBack} className="back-button1">
              <img src="/images/previous_button.png" alt="Previous" className="icon" />
              이전
            </button>
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

              <Form.Control size="lg" type="text" placeholder="음식명" value={foodName} onChange={(e) => setFoodName(e.target.value)} />
              <br />
              <Form.Control type="text" placeholder="문구 추가..." value={description} onChange={(e) => setDescription(e.target.value)} />

              {/* 참고한 레시피 섹션 */}
              <div className="recipe-section">
                <h5>참고한 레시피</h5>
                <div className="button-container">
                  <button type="button" className="btn btn-secondary" onClick={() => handleNavigate("/recipes")}>
                    레시피 검색
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowBookmarkModal(true)}>
                    내 북마크에서 찾기
                  </button>
                </div>
              </div>

              <div className="submit-button">
                <button type="submit" className="btn btn-primary">
                  작성 완료
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {showBookmarkModal && <UserBookmarkRecipe closeModal={() => setShowBookmarkModal(false)} bookmarks={bookmarkData} />}
    </div>
  )
}

export default FeedWrite
