import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/base/SearchBar.css";

function SearchBar({ onSearch, initialQuery }) {
  const [query, setQuery] = useState(initialQuery || "");
  const inputRef = useRef(null);  // useRef를 사용하여 input 요소에 접근
  const navigate = useNavigate();

  // query가 변경될 때마다 포커스를 주도록 useEffect 사용
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [query]); // query가 변경될 때마다 실행

  const handleInputChange = (event) => {
    setQuery(event.target.value);
    onSearch(event.target.value); // 입력값이 변경될 때마다 onSearch 호출
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = () => {
    if (query) {
      navigate(`/search-results?query=${query}`); // 검색어를 쿼리 파라미터로 전달
      window.scrollTo(0, 0); // 페이지 상단으로 스크롤 이동
    }
  };

  return (
    <div className="header-all">
      <img src="/images/메인로고.png" className="main-logo" alt="Logo" />
      <div className="search-bar">
        <div className="search-input-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="제목이나 재료를 입력해주세요."
            value={query}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            ref={inputRef} // input 요소에 ref를 설정
          />
          <i className="bi bi-search search-icon" onClick={handleSearch}></i>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
