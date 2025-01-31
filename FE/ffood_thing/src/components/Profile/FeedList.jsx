import React from "react";
import { Link } from "react-router-dom";

const FeedList = ({ feeds }) => {
  // 최신순 정렬
  const sortedFeeds = [...feeds].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="gallery-container">
      {sortedFeeds.map((feed) => (
        <Link 
          to={`/feed/${feed.id}`} 
          key={feed.id} 
          style={{ textDecoration: "none" }} // 링크 스타일 유지
        >
          <img src={feed.image} alt={`Feed ${feed.id}`} className="gallery-image" />
        </Link>
      ))}
    </div>
  );
};

export default FeedList;
