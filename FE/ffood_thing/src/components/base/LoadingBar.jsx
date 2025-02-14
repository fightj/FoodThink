import React, { useState, useEffect } from "react";
import "../../styles/base/LoadingBar.css"; // 스타일 연결

function LoadingBar({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete(), 500); // 로딩 완료 후 페이지 변경
          return 100;
        }
        return prev + 5;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="loading-container">
      {/* GIF 애니메이션 */}
      <img src="/images/cooking.gif" alt="요리 중" className="cooking-gif" />

      {/* 로딩 바 */}
      <div className="loading-bar">
        <div className="loading-progress" style={{ width: `${progress}%` }}></div>
      </div>

      {/* 퍼센트 표시 */}
      <p className="loading-text">{progress}% 완료</p>
    </div>
  );
}

export default LoadingBar;
