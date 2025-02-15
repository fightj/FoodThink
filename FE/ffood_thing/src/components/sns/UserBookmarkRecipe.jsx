import React, { useState } from "react"
import Modal from "react-bootstrap/Modal"
import "bootstrap/dist/css/bootstrap.min.css"
import Swal from "sweetalert2"
import "../../styles/sns/UserBookmarkRecipe.css" // 사용자 정의 CSS 임포트

function UserBookmarkRecipe({ closeModal, bookmarks, onBookmarkSelect }) {
  const [selectedBookmark, setSelectedBookmark] = useState(null)

  const handleBookmarkClick = (bookmark) => {
    Swal.fire({
      title: "이 레시피를 참조하셨나요?",
      showCancelButton: true,
      confirmButtonText: "예",
      cancelButtonText: "아니오",
    }).then((result) => {
      if (result.isConfirmed) {
        onBookmarkSelect(bookmark.recipeId)
        closeModal()
      }
    })
  }

  const handleItemSelect = (bookmark) => {
    setSelectedBookmark(bookmark)
  }

  return (
    <Modal show onHide={closeModal} centered dialogClassName="modal-dialog" className="feed-recipe-bookmark">
      <Modal.Header closeButton>
        <Modal.Title className="my-bookmark-modal-title">나의 북마크 레시피</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          width: "100%",
          height: "100%",
          margin: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {bookmarks.length === 0 ? (
          <p>비어있습니다.</p>
        ) : (
          <div className="bookmark-gallery">
            {bookmarks.map((bookmark, idx) => (
              <div
                key={idx}
                className={`bookmark-gallery-cell ${selectedBookmark === bookmark ? "selected" : ""}`}
                onClick={() => {
                  handleBookmarkClick(bookmark)
                  handleItemSelect(bookmark)
                }}
                style={{
                  cursor: "pointer",
                  backgroundImage: `url(${bookmark.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <h2>{bookmark.title}</h2>
                <span className="scroll-item-date">{bookmark.date}</span>
              </div>
            ))}
          </div>
        )}
      </Modal.Body>
    </Modal>
  )
}

export default UserBookmarkRecipe
