import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/profile/FeedList.css";

const FeedList = () => {
  const navigate = useNavigate();
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const response = await fetch(`https://i12e107.p.ssafy.io/api/feed/read/login`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error(`서버 응답 오류: ${response.status}`);

        let data = await response.json();
        console.log("📌 불러온 피드 데이터:", data);

        // 최신순 정렬 (date 기준)
        setFeeds(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
      } catch (error) {
        console.error("❌ 피드 불러오기 실패:", error);
        setError("피드를 불러오는 중 문제가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeeds();
  }, []);

  if (loading) return <div className="feed-container">⏳ 피드를 불러오는 중...🤔</div>;

  if (!feeds.length) {
    return (
      <div className="feed-container">
        <div className="no-feeds-wrapper">
          <div className="no-feeds-text">📌 등록된 피드가 없습니다. 😯</div>
          <button className="write-feed-button" onClick={() => navigate("/feed/write")}>
            ➕ 피드 작성하러 가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="feed-container">
      {feeds.map((feed) => (
        <Link 
          to={`/feed/${feed.feedId}`} 
          key={feed.feedId} 
          style={{ textDecoration: "none" }} 
        >
          <img src={feed.image} alt={`Feed ${feed.feedId}`} className="feed-image" />
        </Link>
      ))}
    </div>
  );
};

export default FeedList;
