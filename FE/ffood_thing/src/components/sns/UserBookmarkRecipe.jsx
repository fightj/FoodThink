import React from "react"
import Modal from "react-bootstrap/Modal"
import Carousel from "react-bootstrap/Carousel"
import "bootstrap/dist/css/bootstrap.min.css"
import "../../styles/sns/UserBookmarkRecipe.css"
import Swal from "sweetalert2"

function UserBookmarkRecipe({ closeModal, bookmarks, onBookmarkSelect }) {
  const chunkArray = (array, chunkSize) => {
    const chunks = []
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize))
    }
    return chunks
  }

  const cardGroups = chunkArray(bookmarks, 3)

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

  return (
    <Modal show onHide={closeModal} centered dialogClassName="modal-dialog">
      <Modal.Header closeButton>
        <Modal.Title>내 북마크 레시피</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {bookmarks.length === 0 ? (
          <p>비어있습니다.</p>
        ) : (
          <Carousel>
            {cardGroups.map((group, index) => (
              <Carousel.Item key={index}>
                <div className="bookmark-card-container d-flex justify-content-around">
                  {group.map((bookmark, idx) => (
                    <div key={idx} className="bookmark-card mx-2" onClick={() => handleBookmarkClick(bookmark)} style={{ cursor: "pointer" }}>
                      <img className="d-block w-100" src={bookmark.image} alt={bookmark.title} />
                      <Carousel.Caption>
                        <h5>{bookmark.title}</h5>
                      </Carousel.Caption>
                    </div>
                  ))}
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        )}
      </Modal.Body>
    </Modal>
  )
}

export default UserBookmarkRecipe
