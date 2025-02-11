import React from "react";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import "flickity/css/flickity.css"; // Flickity CSS 임포트
import Flickity from "react-flickity-component"; // Flickity 컴포넌트 임포트
import "../../styles/sns/UserBookmarkRecipe.css"; // 사용자 정의 CSS 임포트

const flickityOptions = {
  wrapAround: true
};

function UserBookmarkRecipe({ closeModal, bookmarks, onBookmarkSelect }) {
  const handleBookmarkClick = (bookmark) => {
    Swal.fire({
      title: "이 레시피를 참조하셨나요?",
      showCancelButton: true,
      confirmButtonText: "예",
      cancelButtonText: "아니오",
    }).then((result) => {
      if (result.isConfirmed) {
        onBookmarkSelect(bookmark.recipeId);
        closeModal();
      }
    });
  };

  return (
    <Modal show onHide={closeModal} centered dialogClassName="modal-dialog" style={{ minWidth: "80vw", minHeight: "50vh", margin: "auto" }}>
      <Modal.Header closeButton>
        <Modal.Title>내 북마크 레시피</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ width: "100%", height: "100%", margin: "auto", display: "flex", justifyContent: "center", alignItems: "center" }}>
        {bookmarks.length === 0 ? (
          <p>비어있습니다.</p>
        ) : (
          <Flickity
            className={"bookmark-gallery"}
            elementType={"div"}
            options={flickityOptions}
            disableImagesLoaded={false}
            reloadOnUpdate
          >
            {bookmarks.map((bookmark, idx) => (
              <div
                key={idx}
                className="bookmark-gallery-cell"
                onClick={() => handleBookmarkClick(bookmark)}
                style={{ cursor: "pointer", backgroundImage: `url(${bookmark.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                cursor: "pointer"}}
              >
                <h2>{bookmark.title}</h2>
                <span className="scroll-item-date">{bookmark.date}</span>
              </div>
            ))}
          </Flickity>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default UserBookmarkRecipe;
