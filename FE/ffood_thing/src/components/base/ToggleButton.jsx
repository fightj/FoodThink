// 어디에서나 떠있는 토글 버튼
// 사이드바를 언제 어디서나 본다.
import React, { useState } from "react";
import "../../styles/base/ToggleButton.css";

const ToggleButton = ({ toggleSidebar }) => {
    return (
      <button className="toggle-button" onClick={toggleSidebar}>
        ☰
      </button>

    );
  };
  
  export default ToggleButton;