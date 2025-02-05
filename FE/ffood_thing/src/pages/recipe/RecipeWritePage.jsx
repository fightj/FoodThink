import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/recipe/RecipeWritePage.css";

function RecipeWritePage() {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState([{ name: "", amount: "" }]);
  const [steps, setSteps] = useState([""]); // 요리 순서
  const [image, setImage] = useState(null);

  // 📌 재료 추가
  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", amount: "" }]);
  };

  // 📌 재료 삭제
  const removeIngredient = (index) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };

  // 📌 요리 순서 추가
  const addStep = () => {
    setSteps([...steps, ""]);
  };

  // 📌 요리 순서 삭제
  const removeStep = (index) => {
    const newSteps = [...steps];
    newSteps.splice(index, 1);
    setSteps(newSteps);
  };

  // 📌 이미지 업로드 핸들러
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="base-div">
    <div className="parent-container">
    <div className="recipe-write-container">

      {/* 레시피 등록 헤더 (제목 + 뒤로가기 버튼) */}
      <div className="recipe-header">
        <button onClick={() => navigate(-1)} className="back-button">
        <img src="/images/previous_button.png" alt="Previous" className="icon" />
        </button>
        <div className="recipe-title">레시피 등록</div>
      </div>

      {/* 📌 제목 & 소개 + 대표 이미지 */}
      <div className="recipe-info-container">
        <div className="recipe-text-section">
          <label className="form-label">레시피 제목</label>
          <input type="text" className="text-input" placeholder="예) 연어 초밥 만들기" />

          <label className="form-label">요리 소개</label>
          <textarea className="text-area" placeholder="이 레시피의 탄생배경을 적어주세요.
예) 초밥 초보자도 쉽게 만들 수 있어서 집에서도 간편하게 즐길 수 있어요!"></textarea>
        </div>

        {/* 요리 대표 사진 업로드 */}
        <div className="image-upload-container">
          <input type="file" id="imageUpload" accept="image/*" onChange={handleImageUpload} hidden />
          <label htmlFor="imageUpload" className="image-placeholder">
            {image ? <img src={image} alt="요리 이미지" className="uploaded-image" /> : "📷 요리 대표 사진을 등록해주세요."}
          </label>
        </div>
      </div>

      {/* 📌 카테고리 선택 */}
      <div className="category-container">
        <label className="form-label">카테고리</label>
        <select className="dropdown">
          <option>종류별</option>
          <option>한식</option>
          <option>양식</option>
        </select>
        <select className="dropdown">
          <option>메인재료별</option>
          <option>고기</option>
          <option>채소</option>
        </select>
      </div>

      {/* 📌 요리 정보 선택 */}
      <div className="cooking-info-container">
        <label className="form-label">요리정보</label>
        <select className="dropdown">
          <option>인분</option>
          <option>1인분</option>
          <option>2인분</option>
        </select>
        <select className="dropdown">
          <option>시간</option>
          <option>10분 이내</option>
          <option>30분</option>
        </select>
        <select className="dropdown">
          <option>난이도</option>
          <option>쉬움</option>
          <option>어려움</option>
        </select>
      </div>

      {/* 📌 재료 입력 */}
      <div className="ingredients-container">
        <label className="form-label">재료정보</label>
        {ingredients.map((ingredient, index) => (
          <div className="ingredient-input-group" key={index}>
            <input type="text" className="text-input small" placeholder="예) 연어" />
            <input type="text" className="text-input small" placeholder="예) 300g" />
            <button className="delete-btn" onClick={() => removeIngredient(index)}>❌</button>
          </div>
        ))}
        <button className="add-btn" onClick={addIngredient}>➕ 재료 추가</button>
      </div>

      {/* 📌 요리 순서 입력 */}
      <div className="steps-container">
        <label className="form-label">요리순서</label>
        {steps.map((step, index) => (
          <div className="step-input-group" key={index}>
            <textarea className="text-area small" placeholder={`Step ${index + 1}`} />
            <button className="delete-btn" onClick={() => removeStep(index)}>❌</button>
          </div>
        ))}
        <button className="add-btn" onClick={addStep}>➕ 순서 추가</button>
      </div>

      {/* 📌 저장/취소 버튼 */}
      <div className="button-group">
        <button className="save-btn">저장</button>
        <button className="publish-btn">저장 후 공개하기</button>
        <button className="cancel-btn">취소</button>
      </div>
      </div>
      </div>
    </div>
  );
}

export default RecipeWritePage;
