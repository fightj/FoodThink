import React from "react"
import { Link } from "react-router-dom"
import "../../styles/profile/RecipeList.css";

const BookmarkList = ({ bookmarks }) => {
  return (
    <div className="recipe-container">
      <div className="recipe-grid">
        {bookmarks.map((bookmark) => (
          <Link
            to={`/recipes/${bookmark.id}`}
            key={bookmark.id}
            className="recipe-card"
            style={{ textDecoration: "none", color: "inherit" }} // 링크 스타일 유지
          >
            <img src={bookmark.image} alt={bookmark.title} className="recipe-image" />
            <p className="recipe-title">{bookmark.title}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default BookmarkList
