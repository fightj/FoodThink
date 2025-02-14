import React, { useState } from "react"
import "../../styles/base/SearchBar.css"
import Form from "react-bootstrap/Form"

function SearchBar({ onSearch, initialQuery }) {
  const [query, setQuery] = useState(initialQuery || "")

  const handleInputChange = (event) => {
    setQuery(event.target.value)
  }

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch()
    }
  }

  const handleSearch = () => {
    if (onSearch) {
      onSearch(query) // 부모 컴포넌트로 검색어 전달
    }
  }

  return (
    <div className="header-all">
      <img src="/images/메인로고.png" className="main-logo" alt="Logo" />
      <div className="search-bar">
        <div className="search-input-wrapper">
          <input type="text" className="search-input" placeholder="제목이나 재료를 입력해주세요." value={query} onChange={handleInputChange} onKeyPress={handleKeyPress} />
          <i className="bi bi-search search-icon" onClick={handleSearch}></i>
        </div>
      </div>
    </div>
  )
}

export default SearchBar
