import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import "../../styles/base/global.css";
import "../../styles/recommend/AiRecommendPage.css";
import LoginCheck from "../../components/base/LoginCheck";

const questionsData = [
  { question: "어떤 맛을 원하시나요?", options: ["매운 음식", "단 음식", "짠 음식"] },
  { question: "어떤 종류의 음식을 원하시나요?", options: ["국물요리", "밥종류", "면요리"] },
  { question: "요리 난이도를 선택해주세요.", options: ["쉬운 요리", "보통 난이도의 요리", "어려운 요리"] },
  { question: "어떤 식사를 원하시나요?", options: ["아침식사", "점심식사", "저녁식사"] },
  { question: "요리 스타일을 선택해주세요.", options: ["간단요리", "정통요리", "퓨전요리"] },
  { question: "어떤 주재료를 원하시나요?", options: ["닭고기", "돼지고기", "소고기"] },
  { question: "채소를 많이 포함한 요리를 원하시나요?", options: ["채소가 많이", "채소가 조금", "채소 없이"] },
  { question: "특정 국가 요리를 원하시나요?", options: ["한식", "양식", "중식"] },
  { question: "매운 정도를 선택해주세요.", options: ["안 매운맛", "보통 매운맛", "아주 매운맛"] },
  { question: "시간이 얼마나 걸릴까요?", options: ["10분 이내", "30분 이내", "1시간 이상"] },
  { question: "어떤 조리 방법을 원하시나요?", options: ["볶음", "튀김", "찜"] },
  { question: "누구와 함께 식사를 하나요?", options: ["혼자먹어요", "친구와 함께", "가족과 함께"] },
  { question: "어떤 식감을 원하시나요?", options: ["부드러운", "쫄깃한", "바삭한"] },
  { question: "기분에 따라 어떤 요리를 드시고 싶나요?", options: ["기운 나는 음식", "가벼운 음식", "든든한 음식"] },
  { question: "어떤 국물을 선호하시나요?", options: ["맑은 국물", "걸쭉한 국물", "국물 없이"] },
];

function AiRecommendPage() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [availableQuestions, setAvailableQuestions] = useState([...questionsData]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    pickNextQuestion();
  }, []);

  // 새로운 질문 선택 (중복 방지)
  const pickNextQuestion = () => {
    if (availableQuestions.length === 0) {
      sendToBackend(answers);
      return;
    }

    const nextIndex = Math.floor(Math.random() * availableQuestions.length);
    setCurrentQuestion(availableQuestions[nextIndex]);
    setAvailableQuestions(prev => prev.filter((_, i) => i !== nextIndex)); // 선택한 질문 제거
  };

  // 답변 선택
  const handleChoice = (answer) => {
    setAnswers(prev => {
      const updatedAnswers = [...prev, answer];
      if (updatedAnswers.length === 5 || availableQuestions.length === 0) {
        sendToBackend(updatedAnswers);
      } else {
        pickNextQuestion();
      }
      return updatedAnswers;
    });
  };

  // 질문 건너뛰기 (답변 없이 다음 질문)
  const handleSkipQuestion = () => {
    if (availableQuestions.length > 0) {
      pickNextQuestion();
    } else {
      sendToBackend(answers);
    }
  };

  // "엔드 버튼" - 현재까지의 답변으로 API 요청
  const handleEndSurvey = () => {
    sendToBackend(answers);
  };

  // API 요청
  const sendToBackend = async (userAnswers) => {
    setLoading(true);

    const API_URL = "https://i12e107.p.ssafy.io/api/recommend/final-recommend";
    const requestData = { answers: userAnswers };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (error) {
        throw new Error("서버에서 올바른 JSON을 반환하지 않았습니다.");
      }

      if (!Array.isArray(data)) {
        throw new Error("추천된 레시피가 없습니다.");
      }

      setRecipes(data);
    } catch (error) {
      alert("추천된 레시피를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="base-div">
      <LoginCheck />

      <div className="parent-container">
        <div className="card-div">
          <div className="ai-recommend-container">
            <div className="speech-bubble">
              {recipes.length > 0 ? "🍽 추천된 레시피 🍽" : currentQuestion?.question}
            </div>
            <div className="ai-content">
              {recipes.length === 0 ? (
                <>
                  {currentQuestion?.options.map((option, index) => (
                    <div className="choice-card" key={index}>
                      <button className="choice-btn" onClick={() => handleChoice(option)}>
                        {option}
                      </button>
                    </div>
                  ))}
                  <div className="button-container">
                    <button className="skip-btn" onClick={handleSkipQuestion}>
                      ⏩ 다음 질문 받기
                    </button>
                    <button className="end-btn" onClick={handleEndSurvey}>
                      🚀 엔드 버튼
                    </button>
                  </div>
                </>
              ) : (
                <div className="recipe-list">
                  {recipes.map((recipe) => (
                    <div key={recipe.recipeId} className="recipe-card" onClick={() => navigate(`/recipes/${recipe.recipeId}`)}>
                      <img src={recipe.image} alt={recipe.recipeTitle} className="recipe-image" />
                      <div className="recipe-title">{recipe.recipeTitle}</div>
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
