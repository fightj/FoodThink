import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/login/FirstLogin.css";
import Preference from "../../components/Profile/Preference";

function FirstLogin() {
  const navigate = useNavigate();
  const [showStartPage, setShowStartPage] = useState(true); // 시작 페이지 표시 여부
  const [showPreference, setShowPreference] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [gifKey, setGifKey] = useState(Date.now()); // GIF 새로고침 시 초기화

  useEffect(() => {
    // 3초 후 자동으로 튜토리얼(GIF) 페이지로 이동
    const startPageTimer = setTimeout(() => {
      setShowStartPage(false);
    }, 2000); // 3초 뒤에 페이지 전환

    return () => clearTimeout(startPageTimer); // 클린업 함수
  }, []);

  useEffect(() => {
    if (!showStartPage) {
      // 시작 페이지가 사라진 후에만 실행
      setGifKey(Date.now());

      // 10초 후 "나의 선호도" 버튼 표시
      const timer = setTimeout(() => {
        setShowButton(true);
      }, 20000); // 20초 후 버튼 표시

      return () => clearTimeout(timer);
    }
  }, [showStartPage]);

  const handleFinishPreference = () => {
    navigate("/");
  };

  return (
    <div className="first-login-container">
      {/* ✅ 시작 페이지 (3초 후 자동 전환) */}
      {showStartPage ? (
        <div className="start-page">
        <div className="start-page-header">
          <h1>푸띵 사용법</h1>
          <img src="/images/꾸덕이.png" alt="AI 캐릭터" />
        </div>
        <p>푸띵을 쉽게 활용하는 방법을 알아보세요!</p>
      </div>
      ) : !showPreference ? (
        <div className="tutorial-content">
          <img key={gifKey} src="/images/최종3.gif" alt="튜토리얼 GIF" />
          <div className="button-container">
            {showButton && (
              <div className="button-text">내 선호도를 등록하러 가볼까요?
              &nbsp;
              <button onClick={() => setShowPreference(true)}>Click!</button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <Preference onFinish={handleFinishPreference} />
      )}
    </div>
  );
}

export default FirstLogin;
