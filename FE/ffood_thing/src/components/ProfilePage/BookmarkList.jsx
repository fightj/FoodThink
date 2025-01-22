import React from "react";
import "../../styles/ProfilePage.css";

const BookmarkList = () => {
  const bookmarks = [
    { id: 1, title: "고소한 마늘빵 🥖", image: "/images/bookmark1.jpg" },
    { id: 2, title: "치즈 떡볶이 🌶️🧀", image: "/images/bookmark2.jpg" },
    { id: 3, title: "홈메이드 수제버거 🍔", image: "/images/bookmark3.jpg" },
    { id: 4, title: "초콜릿 브라우니 🍫", image: "/images/bookmark4.jpg" },
  ];

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
