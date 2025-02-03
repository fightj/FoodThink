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
  // 로그인 기능이 없으므로 첫 번째 유저(`id: "1"`)를 기본값으로 사용
  const user = profileData[0]; // profileData 배열에서 첫 번째 유저 가져오기

  // Local Storage에서 기존 저장된 데이터 불러오기
  const storedPreferences = JSON.parse(localStorage.getItem("selectedPreferences")) || user.preferences;
  const storedAvoidances = JSON.parse(localStorage.getItem("selectedAvoidances")) || user.avoidances;

  // 유저의 선호/기피 음식 상태 관리
  const [selectedPreferences, setSelectedPreferences] = useState(storedPreferences);
  const [selectedAvoidances, setSelectedAvoidances] = useState(storedAvoidances);
  const modalRef = useRef(null);

  // 모달 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // 버튼 클릭 시 선택/해제 (선호/기피 구분)
  const handleToggle = (item, isAvoidance = false) => {
    if (isAvoidance) {
      setSelectedAvoidances((prev) =>
        prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
      );
    } else {
      setSelectedPreferences((prev) =>
        prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
      );
    }
  };

  // 저장 버튼 클릭 시 Local Storage에 저장 (임시 저장 유지)
  const handleSave = () => {
    localStorage.setItem("selectedPreferences", JSON.stringify(selectedPreferences));
    localStorage.setItem("selectedAvoidances", JSON.stringify(selectedAvoidances));

    console.log("저장됨:", { selectedPreferences, selectedAvoidances });
    onClose();
  };

  return (
    <>
      <div className="modal-backdrop" onClick={onClose}></div>

      <div className="preference-container" ref={modalRef}>
        <div className="preference-wrapper">
          {/* 선호 음식 섹션 */}
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

          {/* 세로 구분선 */}
          {/* <div className="divider"></div> */}

          {/* 기피 재료 섹션 */}
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
