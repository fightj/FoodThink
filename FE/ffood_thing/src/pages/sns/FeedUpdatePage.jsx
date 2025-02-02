import React, { useState, useRef, useEffect } from "react";
import imageIcon from "../../assets/image.svg";
import { Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { Feed, FeedImages } from "./feed_data";
import "../../styles/sns/FeedWrite.css";

function FeedUpdatePage() {
  const { id } = useParams();
  const feedId = parseInt(id);
  const navigate = useNavigate();

  const [selectedImages, setSelectedImages] = useState(() => {
    const savedImages = localStorage.getItem(`selectedImages_${feedId}`);
    return savedImages ? JSON.parse(savedImages) : [];
  });
  const [checkedImages, setCheckedImages] = useState(() => {
    const savedCheckedImages = localStorage.getItem(`checkedImages_${feedId}`);
    return savedCheckedImages ? JSON.parse(savedCheckedImages) : [];
  });
  const [foodName, setFoodName] = useState(() => localStorage.getItem(`foodName_${feedId}`) || "");
  const [description, setDescription] = useState(() => localStorage.getItem(`description_${feedId}`) || "");
  const fileInputRef = useRef();

  useEffect(() => {
    const currentFeed = Feed.find((item) => item.feed_id === feedId);
    if (currentFeed) {
      setFoodName((prev) => prev || currentFeed.food_name);
      setDescription((prev) => prev || currentFeed.content);

      const images = FeedImages.filter((image) => image.feed_id === feedId);
      const previews = images.map((image) => ({
        id: image.image_url,
        file: null,
      }));
      setSelectedImages((prev) => prev.length ? prev : previews);
      setCheckedImages((prev) => prev.length ? prev : previews.map((image) => image.id));
    }
  }, [feedId]);

  useEffect(() => {
    localStorage.setItem(`selectedImages_${feedId}`, JSON.stringify(selectedImages));
    console.log("selectedImages 저장됨:", selectedImages);
  }, [selectedImages, feedId]);

  useEffect(() => {
    localStorage.setItem(`checkedImages_${feedId}`, JSON.stringify(checkedImages));
    console.log("checkedImages 저장됨:", checkedImages);
  }, [checkedImages, feedId]);

  useEffect(() => {
    localStorage.setItem(`foodName_${feedId}`, foodName);
    console.log("foodName 저장됨:", foodName);
  }, [foodName, feedId]);

  useEffect(() => {
    localStorage.setItem(`description_${feedId}`, description);
    console.log("description 저장됨:", description);
  }, [description, feedId]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
      id: URL.createObjectURL(file),
      file,
    }));
    setSelectedImages((prev) => [...prev, ...previews]);
  };

  const handleCheck = (id) => {
    setCheckedImages((prev) =>
      prev.includes(id) ? prev.filter((imgId) => imgId !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const imagesToUpload = selectedImages.filter((img) =>
      checkedImages.includes(img.id)
    );
    console.log("업로드할 이미지:", imagesToUpload);

    // 폼 제출 후 localStorage 비우기
    localStorage.removeItem(`selectedImages_${feedId}`);
    localStorage.removeItem(`checkedImages_${feedId}`);
    localStorage.removeItem(`foodName_${feedId}`);
    localStorage.removeItem(`description_${feedId}`);
  };

  return (
    <div className="base-div">
      <div className="card-div">
        <div className="div-80">
          <button onClick={() => navigate(-1)} className="back-button">
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
                  <input
                    type="checkbox"
                    className="checkbox"
                    onChange={() => handleCheck(image.id)}
                    checked={checkedImages.includes(image.id)}
                  />
                </div>
              ))}
            </div>

            <div className="file-upload" onClick={() => fileInputRef.current.click()}>
              <img src={imageIcon} alt="이미지 아이콘" />
              <p>이미지 선택</p>
              <input
                type="file"
                ref={fileInputRef}
                id="imageUpload"
                name="imageUpload"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
            </div>

            <hr className="featurette-divider" />

            <Form.Control
              size="lg"
              type="text"
              placeholder="음식명"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
            />
            <br />
            <Form.Control
              type="text"
              placeholder="문구 추가..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {/* 참고한 레시피 섹션 */}
            <div className="recipe-section">
              <h5>참고한 레시피</h5>
              <div className="button-container">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/recipes")}
                >
                  레시피 검색
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/profile/1?tab=bookmarks")}
                >
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
      </div>
    </div>
  );
}

export default FeedUpdatePage;
