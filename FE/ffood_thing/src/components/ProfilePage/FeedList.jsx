import React from "react";

const FeedList = ({ feeds }) => {
  // 최신순 정렬
  const sortedFeeds = [...feeds].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="gallery-container">
      {sortedFeeds.map((feed) => (
        <img key={feed.id} src={feed.image} alt={`Feed ${feed.id}`} className="gallery-image" />
      ))}
    </div>
  );
};

export default FeedList;