import React, { useState, useEffect, useRef } from "react";
import "../../styles/profile/Preference.css";
import profileData from "../../data/ProfileData"; // 더미 데이터 가져오기

const PREFERENCE_ITEMS = [
  "고수", "올리브", "블루치즈", "홍어", "마라 소스", "순대 내장",
  "고추냉이", "굴", "청국장", "산낙지", "번데기",
  "미더덕", "우니(성게알)", "라즈베리",
  "피망", "비트", "두리안", "건포도", "해파리 냉채", "샐러리", "가지",
];

const AVOID_ITEMS = [
  "난류(가금류)", "우유", "메밀", "땅콩", "대두", "밀",
  "고등어", "게", "돼지고기", "복숭아", "토마토", "새우"
];

const Preference = ({ onClose }) => {
  const user = profileData[0]; // 첫 번째 유저 기본값 사용

  // Local Storage에서 기존 저장된 데이터 불러오기
  const storedPreferences = JSON.parse(localStorage.getItem("selectedPreferences")) || user.preferences;
  const storedAvoidances = JSON.parse(localStorage.getItem("selectedAvoidances")) || user.avoidances;

  const [selectedPreferences, setSelectedPreferences] = useState(storedPreferences);
  const [selectedAvoidances, setSelectedAvoidances] = useState(storedAvoidances);
  const modalRef = useRef(null);

  // 배경 스크롤 방지 (모달 열릴 때)
  useEffect(() => {
    document.body.style.overflow = "hidden"; // 배경 스크롤 막기
    return () => {
      document.body.style.overflow = "auto"; // 모달 닫힐 때 원래대로
    };
  }, []);

  // 버튼 클릭 시 선택/해제
  const handleToggle = (item, isAvoidance = false) => {
    if (isAvoidance) {
      setSelectedAvoidances((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]));
    } else {
      setSelectedPreferences((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]));
    }
  };

  // 저장 버튼 클릭 시 Local Storage에 저장
  const handleSave = () => {
    localStorage.setItem("selectedPreferences", JSON.stringify(selectedPreferences));
    localStorage.setItem("selectedAvoidances", JSON.stringify(selectedAvoidances));
    onClose();
  };

  return (
    <>
      {/* 모달 배경 */}
      <div className="modal-backdrop"></div>

      {/* 모달 창 */}
      <div className="preference-container">
        {/* 닫기 버튼 */}
        <button className="close-btn" onClick={onClose}>×</button>

        <div className="preference-wrapper">
          <div className="preference-section">
            <h4>선호 음식</h4>
            <div className="preference-list">
              {PREFERENCE_ITEMS.map((item) => (
                <button
                  key={item}
                  className={`preference-btn ${selectedPreferences.includes(item) ? "selected" : ""}`}
                  onClick={() => handleToggle(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          
          <div className="avoidance-section">
            <h4>기피 재료</h4>
            <div className="avoidance-list">
              {AVOID_ITEMS.map((item) => (
                <button
                  key={item}
                  className={`avoidance-btn ${selectedAvoidances.includes(item) ? "selected" : ""}`}
                  onClick={() => handleToggle(item, true)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button className="save-btn" onClick={handleSave}>저장</button>
      </div>
    </>
  );
};

export default Preference;
