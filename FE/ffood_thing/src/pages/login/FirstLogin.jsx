import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/login/FirstLogin.css";
import Preference from "../../components/Profile/Preference";

function FirstLogin() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPreference, setShowPreference] = useState(false);

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setShowPreference(true); // 마지막 단계에서 선호도 설정 실행
    }
  };

  const skipTutorial = () => {
    setShowPreference(true);
  };

  // ✅ 선호도 입력 완료 후 홈으로 이동
  const handleFinishPreference = () => {
    navigate("/");
  };

  return (
    <div className="first-login-container">
      {!showPreference ? (
        <>
          <div className="tutorial-content">
            {step === 1 && <img src="/images/끼쟁이.png" alt="튜토리얼 1" />}
            {step === 2 && <img src="/images/시원이.png" alt="튜토리얼 2" />}
            {step === 3 && <img src="/images/씩씩이.png" alt="튜토리얼 3" />}

            <div className="button-container">
              <button onClick={nextStep}>{step < 3 ? "다음" : "완료"}</button>
              <button onClick={skipTutorial}>건너뛰기</button>
            </div>
          </div>
        </>
      ) : (
        <Preference onFinish={handleFinishPreference} />
      )}
    </div>
  );
}

export default FirstLogin;
