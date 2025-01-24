import React from "react";

const BookmarkList = ({ bookmarks }) => {
  return (
    <div className="recipe-container">
      <div className="recipe-grid">
        {bookmarks.map((bookmark) => (
          <div key={bookmark.id} className="recipe-card">
            <img src={bookmark.image} alt={bookmark.title} className="recipe-image" />
            <p className="recipe-title">{bookmark.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookmarkList;