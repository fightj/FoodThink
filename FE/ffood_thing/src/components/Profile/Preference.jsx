import React, { useState, useEffect, useRef } from "react";
import "../../styles/profile/ProfilePage.css";

const PREFERENCE_ITEMS = ["고수", "파인애플 피자", "올리브", "치즈", "가지", "샐러리", "생강", "해산물"];

const Preference = ({ preferences, onClose, onSave }) => {
  const [selectedItems, setSelectedItems] = useState(preferences);
  const modalRef = useRef(null); // 모달 외부 클릭 감지를 위한 ref

  // 모달 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose(); // 바깥 클릭 시 닫기
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // 체크박스 선택 및 해제 핸들러
  const handleToggle = (item) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  // 저장 버튼 클릭 시 변경된 선호도 ProfilePage로 전달
  const handleSave = () => {
    onSave(selectedItems); // 변경 사항을 ProfilePage에 전달
    onClose(); // 저장 후 창 닫기
  };

  return (
    <>
      {/* 어두운 배경 */}
      <div className="modal-backdrop" onClick={onClose}></div>

      {/* 음식 선호도 모달 */}
      <div className="preference-container" ref={modalRef}>
        <h3>음식 선호도 설정</h3>
        <div className="preference-list">
          {PREFERENCE_ITEMS.map((item) => (
            <label key={item} className="preference-item">
              <input 
                type="checkbox" 
                checked={selectedItems.includes(item)} 
                onChange={() => handleToggle(item)} 
              />
              {item}
            </label>
          ))}
        </div>
        <button className="save-btn" onClick={handleSave}>저장</button>
      </div>
    </>
  );
};

export default Preference;
