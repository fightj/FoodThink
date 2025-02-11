import React from "react"
import Modal from "react-bootstrap/Modal"
import Slider from "react-slick"
import "bootstrap/dist/css/bootstrap.min.css"
import Swal from "sweetalert2"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

function UserBookmarkRecipe({ closeModal, bookmarks, onBookmarkSelect }) {
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

  const settings = {
    infinite: true,
    centerMode: true,
    centerPadding: "0",
    slidesToShow: 3,
    speed: 500,
    focusOnSelect: true,
  }

  return (
    <Modal show onHide={closeModal} centered dialogClassName="modal-dialog" style={{ minWidth: "80vw", minHeight: "50vh", margin: "auto" }}>
      <Modal.Header closeButton>
        <Modal.Title>내 북마크 레시피</Modal.Title>
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
          <Slider {...settings} style={{ width: "100%" }}>
            {bookmarks.map((bookmark, idx) => (
              <div
                key={idx}
                className="bookmark-card"
                onClick={() => handleBookmarkClick(bookmark)}
                style={{
                  width: idx === 1 ? "50%" : "30%",
                  height: idx === 1 ? "40vh" : "30vh",
                  overflow: "hidden",
                  position: "relative",
                  cursor: "pointer",
                  borderRadius: "10px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <img src={bookmark.image} alt={bookmark.title} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" }} />
                <div
                  className="carousel-caption"
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    left: "10px",
                    color: "white",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    padding: "5px",
                    borderRadius: "5px",
                  }}
                >
                  <h5>{bookmark.title}</h5>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </Modal.Body>
    </Modal>
  )
}

export default UserBookmarkRecipe
