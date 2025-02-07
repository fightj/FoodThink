import React from "react"
import Modal from "react-bootstrap/Modal"
import Carousel from "react-bootstrap/Carousel"
import "bootstrap/dist/css/bootstrap.min.css"
import "../../styles/sns/UserBookmarkRecipe.css"

function UserBookmarkRecipe({ closeModal, bookmarks }) {
  // 카드 그룹을 나누기 위해 배열을 슬라이스하는 함수
  const chunkArray = (array, chunkSize) => {
    const chunks = []
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize))
    }
    return chunks
  }

  // 3개씩 나누어진 카드 그룹 배열
  const cardGroups = chunkArray(bookmarks, 3)

  return (
    <Modal show onHide={closeModal} centered>
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
                    <div key={idx} className="bookmark-card mx-2">
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
