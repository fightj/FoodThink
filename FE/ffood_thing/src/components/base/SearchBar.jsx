import React, { useState } from "react"
import "./SearchBar.css"

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
    <div className="search-bar">
      <input type="text" className="form-control" placeholder="Search..." value={query} onChange={handleInputChange} />
      <button className="btn btn-primary" onClick={handleSearch}>
        Search
      </button>
    </div>
  )
}

export default SearchBar
