import React, { useState } from "react"
import "../../styles/base/SearchBar.css"
import Form from "react-bootstrap/Form"

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("")

  const handleInputChange = (event) => {
    setQuery(event.target.value)
  }

  const handleSearch = () => {
    if (onSearch) {
      onSearch(query) // 검색 버튼을 클릭할 때, 부모 컴포넌트로 검색어 전달
    }
  }

  return (
    <div>
      <div className="search-bar">
        <div className="search-input-wrapper">
          <input type="text" className="search-input" placeholder="Search..." value={query} onChange={handleInputChange} />
          <i className="bi bi-search search-icon" onClick={handleSearch}></i>
        </div>
      </div>
    </div>
  )
}

export default SearchBar
