import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/recipe/RecipeWritePage.css";


function RecipeWritePage() {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState([{ name: "", amount: "" }]);
  const [steps, setSteps] = useState([{ text: "", image: null }]);
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("");
  const [mainIngredient, setMainIngredient] = useState("");
  const [servings, setServings] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [difficulty, setDifficulty] = useState("");

  // 📌 대표 사진 업로드 핸들러
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  // 📌 대표 사진 삭제 핸들러
  const removeImage = () => setImage(null);

  // 📌 재료 추가
  const addIngredient = () => setIngredients([...ingredients, { name: "", amount: "" }]);

  // 📌 재료 삭제
  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  // 📌 요리 순서 추가
  const addStep = () => setSteps([...steps, { text: "", image: null }]);

  // 📌 요리 순서 삭제
  const removeStep = (index) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  // 📌 이미지 업로드 핸들러
  const handleStepImageUpload = (event, index) => {
    const file = event.target.files[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setSteps(steps.map((step, i) => (i === index ? { ...step, image: imageUrl } : step)));
  };

  // 📌 이미지 삭제 핸들러
  const removeStepImage = (index) => {
    setSteps(steps.map((step, i) => (i === index ? { ...step, image: null } : step)));
  };

  // 📌 스텝 텍스트 업데이트
  const updateStepText = (index, text) => {
    setSteps(steps.map((step, i) => (i === index ? { ...step, text } : step)));
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

          {/* 입력 영역 (65% 제목 + 소개) (35% 대표 사진) */}
          <div className="recipe-info-container">

            {/* 왼쪽: 제목 + 소개 */}
            <div className="recipe-text-section">
              {/* 레시피 제목 */}
              <div className="recipe-title-container">
                <label className="form-label">레시피 제목</label>
                <input type="text" className="recipe-title-input" placeholder="예) 연어 포케 만들기" />
              </div>

              {/* 요리 소개 */}
              <div className="recipe-description-container">
                <label className="form-label">요리 소개</label>
                <textarea className="recipe-description" placeholder="이 레시피의 탄생배경을 적어주세요." />
              </div>
            </div>

            {/* 오른쪽: 대표 사진 업로드 */}
            <div className="image-upload-container">
              <input type="file" id="imageUpload" accept="image/*" onChange={handleImageUpload} hidden />
              <label htmlFor="imageUpload" className="image-upload-label">
                {image ? (
                  <>
                    <img src={image} alt="요리 대표 이미지" className="uploaded-image" />
                    <button className="remove-image-btn" onClick={removeImage}>✖</button>
                  </>
                ) : (
                  "요리 대표 사진을 등록해주세요."
                )}
              </label>
            </div>
          </div>

          {/* 📌 카테고리 선택 */}
      <div className="category-container">
        <label className="form-label">카테고리</label>
        <select className="dropdown1" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="" disabled>종류별</option>
          <option value="반찬">반찬</option>
          <option value="국/탕">국/탕</option>
          <option value="찌개">찌개</option>
          <option value="디저트">디저트</option>
          <option value="면/만두">면/만두</option>
          <option value="밥/죽/떡">밥/죽/떡</option>
          <option value="김치/젓갈/장류">김치/젓갈/장류</option>
          <option value="양념/소스/잼">양념/소스/잼</option>
          <option value="양식">양식</option>
          <option value="샐러드">샐러드</option>
          <option value="차/음료/술">차/음료/술</option>
          <option value="기타">기타</option>
        </select>

        <select className="dropdown1" value={mainIngredient} onChange={(e) => setMainIngredient(e.target.value)}>
          <option value="" disabled>메인재료별</option>
          <option value="소고기">소고기</option>
          <option value="돼지고기">돼지고기</option>
          <option value="닭고기">닭고기</option>
          <option value="육류">육류</option>
          <option value="채소류">채소류</option>
          <option value="해물류">해물류</option>
          <option value="달걀/유제품">달걀/유제품</option>
          <option value="가공식품">가공식품</option>
          <option value="쌀">쌀</option>
          <option value="밀가루">밀가루</option>
          <option value="건어물류">건어물류</option>
          <option value="버섯류">버섯류</option>
          <option value="과일류">과일류</option>
          <option value="빵/견과류">빵/견과류</option>
          <option value="곡류">곡류</option>
          <option value="기타">기타</option>
        </select>
      </div>

      {/* 📌 요리 정보 선택 */}
      <div className="cooking-info-container">
        <label className="form-label">요리정보</label>
        <select className="dropdown1" value={servings} onChange={(e) => setServings(e.target.value)}>
          <option value="" disabled>인분</option>
          <option value="1인분">1인분</option>
          <option value="2인분">2인분</option>
          <option value="3인분">3인분</option>
          <option value="4인분">4인분</option>
          <option value="5인분">5인분</option>
          <option value="6인분 이상">6인분 이상</option>
        </select>

        <select className="dropdown1" value={cookingTime} onChange={(e) => setCookingTime(e.target.value)}>
          <option value="" disabled>시간</option>
          <option value="5분 이내">5분 이내</option>
          <option value="10분 이내">10분 이내</option>
          <option value="15분 이내">15분 이내</option>
          <option value="20분 이내">20분 이내</option>
          <option value="30분 이내">30분 이내</option>
          <option value="60분 이내">60분 이내</option>
          <option value="90분 이내">90분 이내</option>
          <option value="120분 이내">120분 이내</option>
          <option value="2시간 이상">2시간 이상</option>
        </select>

        <select className="dropdown1" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="" disabled>난이도</option>
          <option value="하">하</option>
          <option value="중">중</option>
          <option value="상">상</option>
        </select>
          </div>

          {/* 📌 재료 입력 */}
          <div className="ingredients-container">
            <label className="form-label">재료정보</label>
            {ingredients.map((ingredient, index) => (
              <div className="ingredient-input-group" key={index}>
                <input type="text" className="text-input small" placeholder="예) 연어" />
                <input type="text" className="text-input small" placeholder="예) 300g" />
                <button type="button" className="btn btn-outline-danger" onClick={() => removeIngredient(index)}>❌</button>
              </div>
            ))}
            <div className="add-ingredient-btn-wrapper">
              <button type="button" className="btn btn-outline-primary" onClick={addIngredient}>재료 추가</button>
            </div>
          </div>

          {/* 📌 요리 순서 입력 */}
          <div className="steps-container">
            <label className="form-label">요리 순서</label>
            {steps.map((step, index) => (
              <div key={index} className="step-input-group">
                <textarea
                  className="text-area small"
                  placeholder={`Step ${index + 1}`}
                  value={step.text}
                  onChange={(e) => updateStepText(index, e.target.value)}
                />
                <div className="step-image-upload">
                  <input
                    type="file"
                    id={`stepImageUpload-${index}`}
                    accept="image/*"
                    onChange={(e) => handleStepImageUpload(e, index)}
                    hidden
                  />
                  <label htmlFor={`stepImageUpload-${index}`} className="step-image-label">
                    {step.image ? (
                      <>
                        <img src={step.image} alt={`Step ${index + 1}`} className="step-uploaded-image" />
                        <button type="button" className="remove-step-image-btn" onClick={() => removeStepImage(index)}>✖</button>
                      </>
                    ) : (
                      "이미지 추가"
                    )}
                  </label>
                </div>
                <button type="button" className="btn btn-outline-danger" onClick={() => removeStep(index)}>
                  ❌
                </button>
              </div>
            ))}
            <div className="add-ingredient-btn-wrapper">
              <button type="button" className="btn btn-outline-primary" onClick={addStep}>순서 추가</button>
            </div>
          </div>
          {/* 📌 저장/취소 버튼 */}
          <div className="button-group">
            <button type="button" className="btn btn-primary">저장</button>
            <button type="button" className="btn btn-success">저장 후 공개하기</button>
            <button type="button" className="btn btn-danger">취소</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeWritePage;
