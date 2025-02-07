import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/base/global.css";
import "../../styles/recommend/AiRecommendPage.css";
import LoginCheck from "../../components/base/LoginCheck"; // ✅ 로그인 체크 추가

const questionsData = [
  { question: "어떤 맛을 원하시나요?", options: ["매운 음식", "단 음식", "짠 음식"] },
  { question: "어떤 종류의 음식을 원하시나요?", options: ["국물요리", "밥종류", "면요리"] },
  { question: "요리 난이도를 선택해주세요.", options: ["쉬운 요리", "보통 난이도의 요리", "어려운 요리"] },
  { question: "어떤 식사를 원하시나요?", options: ["아침식사", "점심식사", "저녁식사"] },
  { question: "요리 스타일을 선택해주세요.", options: ["간단요리", "정통요리", "퓨전요리"] },
  { question: "어떤 주재료를 원하시나요?", options: ["닭고기", "돼지고기", "소고기"] },
  { question: "채소를 많이 포함한 요리를 원하시나요?", options: ["채소가 많은 요리", "채소가 적당한 요리", "채소가 거의 없는 요리"] },
  { question: "특정 국가 요리를 원하시나요?", options: ["한식", "양식", "중식"] },
  { question: "칼로리를 신경 쓰시나요?", options: ["저칼로리", "보통", "고칼로리"] },
  { question: "매운 정도를 선택해주세요.", options: ["안 매운", "보통", "아주 매운"] },
  { question: "예산은 어느 정도인가요?", options: ["저렴한", "보통", "고급요리"] },
  { question: "시간이 얼마나 걸릴까요?", options: ["시간은 10분 이내", "시간은 30분 이내", "시간은 1시간 이상"] },
  { question: "채식주의 식단이 필요하신가요?", options: ["비건", "페스코", "고기를 포함해도 괜찮아요"] },
  { question: "특별한 날을 위한 요리인가요?", options: ["기념일", "일반식사", "파티음식"] },
  { question: "어떤 조리 방법을 원하시나요?", options: ["볶음", "튀김", "찜"] },
];

function AiRecommendPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const shuffled = [...questionsData].sort(() => 0.5 - Math.random()).slice(0, 5);
    setQuestions(shuffled);
  }, []);

  const handleChoice = (answer) => {
    console.log(`✅ 선택한 답변: ${answer}`);

    setAnswers((prev) => {
      const updatedAnswers = [...prev, answer];
      console.log("📌 현재까지의 답변 리스트:", updatedAnswers);

      if (updatedAnswers.length === 5) {
        sendToBackend(updatedAnswers);
      } else {
        setCurrentIndex(currentIndex + 1);
      }
      return updatedAnswers;
    });
  };

  const sendToBackend = async (userAnswers) => {
    setLoading(true);
  
    const API_URL = "https://i12e107.p.ssafy.io/api/recommend/final-recommend";
    const requestData = { answers: userAnswers };

    console.log("📌 API 요청 시작:", JSON.stringify(requestData));

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
  
      console.log("📌 서버 응답 상태 코드:", response.status);
  
      if (!response.ok) {
        throw new Error(`서버 응답 오류: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("📌 백엔드 응답 데이터:", data);
  
      setRecipes(data);
    } catch (error) {
      console.error("❌ 추천 요청 실패:", error);
      alert("추천된 레시피를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="base-div">
      <LoginCheck /> {/* ✅ 로그인 체크 컴포넌트 추가 */}

      <div className="parent-container">
        <div className="card-div">
          <div className="ai-recommend-container">
            <div className="speech-bubble">
              {recipes.length > 0 ? "🍽 추천된 레시피 🍽" : questions[currentIndex]?.question}
            </div>

            <div className="ai-content">
              {recipes.length === 0 ? (
                questions[currentIndex]?.options.map((option, index) => (
                  <div className="choice-card" key={index}>
                    <button className="choice-btn" onClick={() => handleChoice(option)}>
                      {option}
                    </button>
                  </div>
                ))
              ) : (
                <div className="recipe-list">
                  {recipes.map((recipe) => (
                    <div key={recipe.recipeId} className="recipe-card" onClick={() => navigate(`/recipe/${recipe.recipeId}`)}>
                      <img src={recipe.image} alt={recipe.recipeTitle} className="recipe-image" />
                      <p className="recipe-title">{recipe.recipeTitle}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {loading && <div className="loading-text">추천받는 중...</div>}

            {recipes.length > 0 && (
              <button className="btn btn-primary" onClick={() => navigate("/")}>
                홈으로 돌아가기
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AiRecommendPage;
