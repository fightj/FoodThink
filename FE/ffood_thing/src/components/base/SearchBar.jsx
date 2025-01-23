import React, { useState } from "react"
import "../../styles/base/SearchBar.css"
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
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
    <div className="top-bar">
      {/* <InputGroup className="mb-3">
        <Form.Control
          placeholder="Recipient's username"
          aria-label="Recipient's username"
          aria-describedby="basic-addon2"
        />
        
        <InputGroup.Text id="basic-addon2">@example.com</InputGroup.Text>
        <i className="bi bi-search search-icon" onClick={handleSearch}></i>

      </InputGroup> */}
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
