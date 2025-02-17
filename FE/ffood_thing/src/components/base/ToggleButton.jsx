// 어디에서나 떠있는 토글 버튼
// 사이드바를 언제 어디서나 본다.
import React, { useState } from "react";
import Draggable from "react-draggable";
import "../../styles/base/ToggleButton.css";

const ToggleButton = ({ toggleSidebar }) => {
    // const [isDragging, setIsDragging] = useState(false);

    // //드래그 시작 시 클릭 이벤트 무시
    // const handleStart = () => {
    //     console.log("드래그 시작");
    //     setIsDragging(true);
    // };

    // //드래그 종료 후 클릭 이벤트 활성화
    // const handleStop = () => {
    //     console.log("드래그 종료");
    //     setIsDragging(false);
    // }

    // //클릭 이벤트 처리 : 드래그 중이 아닐 때
    // const handleClick = (e) => {
    //     console.log("클릭 이벤트 중 ", isDragging);
    //     if(!isDragging) {
    //         console.log("사이드바 토클 실행");
    //         toggleSidebar();
    //     }
    // };

    return (
      <button className="toggle-button" onClick={toggleSidebar}>
        ☰
      </button>
    // <Draggable onStart={handleStart} onStop={handleStop}>
    //   <button className="toggle-button" onClick={handleClick}>
    //     ☰
    //   </button>
    // </Draggable>
    );
  };
  
  export default ToggleButton;