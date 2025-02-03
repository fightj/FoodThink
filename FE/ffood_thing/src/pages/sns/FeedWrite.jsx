import React, { useState, useRef } from "react";
import imageIcon from "../../assets/image.svg"; // SVG 파일 경로
import { Form } from "react-bootstrap"; // react-bootstrap에서 Form 가져오기
import { useNavigate } from "react-router-dom"; // useNavigate import

function FeedWrite() {
  const [selectedImages, setSelectedImages] = useState([]); // 사용자가 선택한 이미지
  const [checkedImages, setCheckedImages] = useState([]); // 체크박스로 선택된 이미지
  const fileInputRef = useRef(); // 파일 입력 요소 접근용 ref
  const navigate = useNavigate(); // navigate 훅 사용

  // 이미지 선택
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); // 선택된 파일
    const previews = files.map((file) => ({
      id: URL.createObjectURL(file), // 미리보기 URL 생성
      file, // 실제 파일 저장
    }));
    setSelectedImages((prev) => [...prev, ...previews]); // 기존 이미지에 추가
  };

  // 체크박스로 이미지 선택
  const handleCheck = (id) => {
    setCheckedImages((prev) =>
      prev.includes(id) ? prev.filter((imgId) => imgId !== id) : [...prev, id]
    );
  };

  // 업로드 버튼 클릭
  const handleSubmit = (e) => {
    e.preventDefault();
    const imagesToUpload = selectedImages.filter((img) =>
      checkedImages.includes(img.id)
    );
    console.log("업로드할 이미지:", imagesToUpload);
    // 업로드 로직 추가
  };

  return (
    <div className="base-div">
      <div className="card-div">
        <div style={{ width: "80%", margin: "0 auto" }}>
          {/* 이전 버튼 클릭 시, 이전 페이지로 이동 */}
          <button onClick={() => navigate(-1)} className="back-button">
            <img src="/images/previous_button.png" alt="Previous" className="icon" />
            이전
          </button>
          <form onSubmit={handleSubmit}>
            {/* 미리보기와 체크박스 */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              {selectedImages.map((image) => (
                <div
                  key={image.id}
                  style={{
                    position: "relative",
                    width: "calc(33.33% - 10px)", // 3개씩 배치
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      paddingBottom: "100%", // 정사각형 유지
                      position: "relative",
                      overflow: "hidden",
                      borderRadius: "8px",
                    }}
                  >
                    <img
                      src={image.id}
                      alt="미리보기"
                      style={{
                        position: "absolute",
                        top: "0",
                        left: "0",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <input
                    type="checkbox"
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      width: "20px",
                      height: "20px",
                    }}
                    onChange={() => handleCheck(image.id)}
                  />
                </div>
              ))}
            </div>

            {/* 파일 선택 */}
            <div
              style={{
                border: "2px dashed #ccc",
                padding: "20px",
                borderRadius: "8px",
                textAlign: "center",
                cursor: "pointer",
                marginTop: "20px", // 미리보기 아래로 이동
              }}
              onClick={() => fileInputRef.current.click()}
            >
              <img
                src={imageIcon}
                alt="이미지 아이콘"
                style={{ width: "2rem", height: "2rem", marginBottom: "10px" }}
              />
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

            {/* 추가 정보 입력 */}
            <hr className="featurette-divider" />

            <Form.Control size="lg" type="text" placeholder="음식명" />
            <br />
            <Form.Control type="text" placeholder="문구 추가..." />

            {/* 게시물 작성 버튼 */}
            <div
              className="submit-button"
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px", // 상단 여백 추가
              }}
            >
              <button type="submit" className="btn btn-primary">
                공유 하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FeedWrite;
