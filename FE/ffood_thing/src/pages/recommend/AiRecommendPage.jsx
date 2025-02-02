import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 훅 추가
import "../../styles/base/global.css"; // 전역 스타일 적용
import "../../styles/recommend/AiRecommendPage.css"; // 페이지 스타일 적용

function AiRecommendPage() {
  const navigate = useNavigate(); // 홈으로 이동하기 위한 함수

  // 질문 및 선택지 관리
  const [question, setQuestion] = useState("어떤 방법으로 추천받으시겠습니까?");
  const [options, setOptions] = useState([
    { text: "기분으로!", image: "/images/mood.jpg", nextQuestion: "지금 기분이 어떤가요? 😊", type: "mood" },
    { text: "재료로!", image: "/images/ingredients.jpg", nextQuestion: "어떤 재료를 사용하고 싶나요? 🍽️", type: "ingredient" }
  ]);

  // 선택 시 질문과 선택지 변경
  const handleChoice = (choice) => {
    if (choice === "mood") {
      setQuestion("지금 기분이 어떤가요? 😊");
      setOptions([
        { text: "기분 최고! 😆", image: "/images/happy.jpg", nextQuestion: "이런 음식은 어때요? 🍔", type: "result" },
        { text: "건강한 음식! 🥗", image: "/images/healthy.jpg", nextQuestion: "이런 음식은 어때요? 🥗", type: "result" }
      ]);
    } else if (choice === "ingredient") {
      setQuestion("어떤 재료를 사용하고 싶나요? 🍽️");
      setOptions([
        { text: "고기 🥩", image: "/images/meat.jpg", nextQuestion: "이런 음식은 어때요? 🍖", type: "result" },
        { text: "채소 🥦", image: "/images/veggie.jpg", nextQuestion: "이런 음식은 어때요? 🥗", type: "result" }
      ]);
    } else if (choice === "result") {
      setQuestion(options.find(opt => opt.type === "result").nextQuestion);
      setOptions([]); // 최종 결과에서는 선택지 제거
    }
  };

  return (
    <div className="base-div">
      <div className="card-div">
        <div className="ai-recommend-container">

          {/* AI 캐릭터와 말풍선 (고정) */}
          <div className="speech-bubble">{question}</div>
          <div className="ai-content">
            {/* 왼쪽 선택지 */}
            {options.length > 0 && (
              <div className="choice-card left">
                <img src={options[0].image} alt={options[0].text} className="choice-image" />
                <button className="choice-btn" onClick={() => handleChoice(options[0].type)}>
                  {options[0].text}
                </button>
              </div>
            )} 

            {/* AI 캐릭터 (중앙) */}
            <img src="/images/ai.jpg" alt="AI 캐릭터" className="ai-image" />

            {/* 오른쪽 선택지 */}
            {options.length > 1 && (
              <div className="choice-card right">
                <img src={options[1].image} alt={options[1].text} className="choice-image" />
                <button className="choice-btn" onClick={() => handleChoice(options[1].type)}>
                  {options[1].text}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AiRecommendPage;
