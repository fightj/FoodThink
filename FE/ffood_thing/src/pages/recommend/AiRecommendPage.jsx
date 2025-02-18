import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import Swal from "sweetalert2";
import "../../styles/base/global.css";
import "../../styles/recommend/AiRecommendPage.css";
import LoginCheck from "../../components/base/LoginCheck";
import LoadingBar from "../../components/base/LoadingBar";

// AI 캐릭터 이미지 배열 (5개)
const aiImages = ["/images/꾸덕이.png", "/images/끼쟁이.png", "/images/샤방이.png", "/images/시원이.png", "/images/씩씩이.png"];

const questionsData = [
  {
    question: "어떤 맛을 원하시나요?",
    options: ["매운 음식", "단 음식", "짠 음식"]
  },
  {
    question: "어떤 종류의 음식을 원하시나요?",
    options: ["국물요리", "밥종류", "면요리"]
  },
  {
    question: "요리 난이도는 어느정도 원하시나요?",
    options: ["쉬운 요리", "보통 난이도의 요리", "어려운 요리"]
  },
  {
    question: "어떤 식사를 원하시나요?",
    options: ["아침식사", "점심식사", "저녁식사"]
  },
  {
    question: "어떤 요리 스타일을 원하시나요?",
    options: ["간단요리", "정통요리", "퓨전요리"]
  },
  {
    question: "어떤 주재료를 원하시나요?",
    options: ["닭고기", "돼지고기", "소고기"]
  },
  {
    question: "채소를 많이 포함한 요리를 원하시나요?",
    options: ["채소가 많이", "채소가 조금", "채소 없이"]
  },
  {
    question: "특정 국가 요리를 원하시나요?",
    options: ["한식", "양식", "중식"]
  },
  {
    question: "어느 정도 매운맛을 원하시나요?",
    options: ["안 매운맛", "보통 매운맛", "아주 매운맛"]
  },
  {
    question: "시간이 얼마나 걸릴까요?",
    options: ["10분 이내", "30분 이내", "1시간 이상"]
  },
  { question: "어떤 조리 방법을 원하시나요?", options: ["볶음", "튀김", "찜"] },
  {
    question: "누구와 함께 식사를 하나요?",
    options: ["혼자먹어요", "친구와 함께", "가족과 함께"]
  },
  {
    question: "어떤 식감을 원하시나요?",
    options: ["부드러운", "쫄깃한", "바삭한"]
  },
  {
    question: "기분에 따라 어떤 요리를 드시고 싶나요?",
    options: ["기운 나는 음식", "가벼운 음식", "든든한 음식"]
  },
  {
    question: "어떤 국물을 선호하시나요?",
    options: ["맑은 국물", "걸쭉한 국물", "국물 없이"]
  }
];

function AiRecommendPage() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [step, setStep] = useState("start"); // start(첫 화면) → question(질문) → loading(로딩) → result(결과)
  const [availableQuestions, setAvailableQuestions] = useState([...questionsData]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [aiImage, setAiImage] = useState(aiImages[Math.floor(Math.random() * aiImages.length)]); // 랜덤 이미지 초기값 설정
  const typedQuestionRef = useRef("");
  const [typedQuestion, setTypedQuestion] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [revealedOptions, setRevealedOptions] = useState([]);

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (step === "question") {
      pickNextQuestion();
    }
  }, [step]);

  useEffect(() => {
    if (showOptions && currentQuestion) {
      revealOptions(currentQuestion.options);
    }
  }, [showOptions, currentQuestion]);
  

  const pickNextQuestion = () => {
    if (availableQuestions.length === 0) return;
  
    const nextIndex = Math.floor(Math.random() * availableQuestions.length);
    const selectedQuestion = availableQuestions[nextIndex];
  
    if (!selectedQuestion || !selectedQuestion.question) return;
  
    // console.log("🔹 선택된 질문:", selectedQuestion.question);
  
    setCurrentQuestion(selectedQuestion);
    setAvailableQuestions((prev) => prev.filter((_, i) => i !== nextIndex));
    setAiImage(aiImages[Math.floor(Math.random() * aiImages.length)]);
    
    typedQuestionRef.current = ""; // 즉시 초기화
    setTypedQuestion(""); // 화면에서도 초기화
    setShowOptions(false);
    setRevealedOptions([]);
  
    setTimeout(() => {
      if (selectedQuestion?.question) {
        // console.log("✅ 최종 설정된 질문:", selectedQuestion.question);
        typeQuestion(selectedQuestion.question.trim());
      }
    }, 100);
  };
  
  
  const typeQuestion = (question) => {
    if (!question || typeof question !== "string") return;
  
    typedQuestionRef.current = ""; // 즉시 초기화
    setTypedQuestion(""); // 화면에도 반영
  
    let i = 0;
    const interval = setInterval(() => {
      if (i < question.length) {
        typedQuestionRef.current += question[i]; // 즉시 업데이트
        setTypedQuestion(typedQuestionRef.current); // 화면에도 반영
        // console.log(`🔠 타이핑 중: ${typedQuestionRef.current}`);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowOptions(true), 500);
      }
    }, 50);
  };
  

  const revealOptions = (options) => {
    setRevealedOptions([]);
    options.forEach((option, index) => {
      setTimeout(() => {
        setRevealedOptions((prev) => [...prev, option]);
      }, index * 300);
    });
  };

  const handleChoice = answer => {
    setAnswers([...answers, answer]);
    if (availableQuestions.length === 0 || answers.length === 4) {
      sendToBackend([...answers, answer]);
    } else {
      pickNextQuestion();
    }
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
  const sendToBackend = async userAnswers => {
    setStep("loading"); // 로딩 화면 표시

    try {
      const response = await fetch("https://i12e107.p.ssafy.io/api/recommend/final-recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ answers: userAnswers })
      });

      const data = await response.json();
      if (!Array.isArray(data)) {
        Swal.fire({ title: "알림", text: "추천된 레시피가 없습니다.", icon: "warning", customClass: { popup: "custom-swal-popup" } });
        setStep("start");
        return;
      }
      setRecipes(data);
      setStep("result"); // 결과 화면으로 전환
    } catch (error) {
      Swal.fire({ title: "오류 발생", text: "추천된 레시피를 불러오지 못했습니다.", icon: "error", customClass: { popup: "custom-swal-popup" } });
      setStep("start");
    }
  };

  return (
    <div className="base-div">
      <LoginCheck />
      {/* ✅ start 스탭이 아닐 때 로고 표시 */}
      <div className="card-div-ai">
        <div className="ai-recommend-container">
          {/* ✅ 맞춤 추천받기 (최초 화면) */}
          {step === "start" && (
            <div className="start-container">
              <div className="start-title">🍽 푸딩에게 추천받기</div>
              <div className="start-description">푸딩이 당신의 취향을 분석해 딱 맞는 요리를 추천해드려요!</div>
              <button className="ai-start-btn" onClick={() => setStep("question")}>
                시작하기 🚀
              </button>
            </div>
          )}

          {/* ✅ 질문 화면 */}
          {step === "question" && (
            <>
              {/* 진행 바 */}
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${(answers.length / 5) * 100}%` }}></div>
              </div>
              <div className="speech-bubble">{typedQuestion}</div>
              <div className="ai-question-container">
                <div className="ai-image-container">
                  <img src={aiImage} alt="AI 도우미" className="ai-image" />
                </div>
                <div className="answer-section">
                  {showOptions && (
                    <div className="answer-selection-container">
                    {revealedOptions.map((option, index) => (
                      <button key={index} className="choice-btn" onClick={() => handleChoice(option)}>
                        {option}
                      </button>
                    ))}
                  </div>
                  )}
                  {/* 선택된 답변 카드 */}
                  {answers.length > 0 && (
                    <div className="selected-answers">
                      {answers.map((answer, index) => (
                        <div key={index} className="answer-card">
                          {answer}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="button-control-container">
                <button className="skip-btn" onClick={handleSkipQuestion}>
                  건너뛰기
                </button>
                <button className="end-btn" onClick={handleEndSurvey}>
                  바로 추천받기
                </button>
              </div>
            </>
          )}

          {/* ✅ 로딩 화면 */}
          {step === "loading" && <LoadingBar onComplete={() => setStep("result")} />}

          {/* ✅ 결과 페이지 */}
          {step === "result" && recipes.length > 0 && (
            <div className="ai-result-container">
              {/* AI 메시지 박스 + AI 캐릭터 컨테이너 */}
              <div className="ai-message-wrapper">
                {/* 왼쪽: 메시지 박스 */}
                <div className="ai-result-message">
                  <span className="nickname-ellipsis">{user?.nickname || "사용자"}</span>
                  님이 찾던 요리에요!
                </div>
                {/* 오른쪽: AI 캐릭터 */}
                <div className="ai-character-container">
                  <img src={aiImage} alt="AI 도우미" className="ai-result-image" />
                </div>
              </div>

              {/* 아래: 추천된 레시피 목록 */}
              <div className="ai-recipe-list">
                {recipes.map(recipe => (
                  <div key={recipe.recipeId} className="ai-recipe-card" onClick={() => navigate(`/recipes/${recipe.recipeId}`)}>
                    <img src={recipe.image} alt={recipe.recipeTitle} className="ai-recipe-image" />
                    <div className="ai-recipe-title">{recipe.recipeTitle}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    // </div>
  );
}

export default AiRecommendPage;
