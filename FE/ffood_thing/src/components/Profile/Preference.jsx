import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import Swal from "sweetalert2";
import "../../styles/profile/Preference.css";

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

const Preference = ({ onClose, userId }) => {
  const { user } = useContext(UserContext); // ✅ 현재 로그인한 사용자 정보 가져오기
  const [selectedPreferences, setSelectedPreferences] = useState([]); // 선호 음식 리스트
  const [selectedAvoidances, setSelectedAvoidances] = useState([]); // 기피 재료 리스트
  const [loading, setLoading] = useState(true);

  // ✅ 백엔드에서 기존 관심사 불러오기 (로컬 저장 X)
  useEffect(() => {
    const fetchUserPreferences = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        Swal.fire("로그인이 필요합니다.", "", "error");
        return;
      }

      try {
        const response = await fetch("https://i12e107.p.ssafy.io/api/users/read/interest", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("관심사 불러오기 실패");
        }

        const data = await response.json();
        console.log("📌 불러온 관심사:", data);

        // ✅ 기존 관심사 필터링
        const likedIngredients = data.filter(item => item.isLiked).map(item => item.ingredient);
        const dislikedIngredients = data.filter(item => !item.isLiked).map(item => item.ingredient);

        setSelectedPreferences(likedIngredients); // 선호 리스트 적용
        setSelectedAvoidances(dislikedIngredients); // 기피 리스트 적용
      } catch (error) {
        console.error("❌ 관심사 불러오기 실패:", error);
        Swal.fire("오류 발생", "관심사 정보를 불러올 수 없습니다.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchUserPreferences();
  }, []);

  // ✅ 버튼 클릭 시 선택/해제
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

  // ✅ 관심사 저장 API 요청
  const saveUserPreferences = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      Swal.fire("로그인이 필요합니다.", "", "error");
      return;
    }

    const requestBody = [
      ...selectedPreferences.map((ingredient) => ({ ingredient, isLiked: true })), // 선호
      ...selectedAvoidances.map((ingredient) => ({ ingredient, isLiked: false })), // 기피
    ];

    try {
      const response = await fetch("https://i12e107.p.ssafy.io/api/users/update/interest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("저장 실패");
      }

      Swal.fire("저장 완료!", "회원 관심사가 저장되었습니다.", "success");
      onClose();
    } catch (error) {
      console.error("❌ 관심사 저장 실패:", error);
      Swal.fire("오류 발생", "관심사 저장 중 오류가 발생했습니다.", "error");
    }
  };

  if (loading) {
    return <div className="loading-text">🔄 관심사 불러오는 중...</div>;
  }

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

        <button className="save-btn" onClick={saveUserPreferences}>저장</button>
      </div>
    </>
  );
};

export default Preference;
