import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import "../../styles/profile/FeedList.css";

const FeedList = ({ userId }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isOwnProfile = user?.userId === userId;

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setError("로그인이 필요합니다.");
          setLoading(false);
          return;
        }

        // API 호출 (본인 or 타인)
        const apiUrl = `https://i12e107.p.ssafy.io/api/feed/read/user/${userId}`;

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error(`서버 응답 오류: ${response.status}`);

        let data = await response.json();
        console.log("📌 불러온 피드 데이터:", data);

        // 최신순 정렬 (date 기준)
        data = data.sort((a, b) => new Date(b.date) - new Date(a.date));

        setFeeds(data);
      } catch (error) {
        console.error("❌ 피드 불러오기 실패:", error);
        setError("피드를 불러오는 중 문제가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchFeeds(); // userId가 존재할 때만 API 호출
  }, [userId]); // userId 변경 시 재요청

  if (loading) return <div className="feed-container">⏳ 피드를 불러오는 중...🤔</div>;
  if (error) return <div className="feed-container">❌ {error}</div>;
  // ✅ 피드가 없을 경우
  if (!feeds || feeds.length === 0) {
    return (
      <div className="feed-container">
        <div className="no-feeds-wrapper">
          <div className="no-feeds-text">📌 등록된 피드가 없습니다. 😯</div>
          {isOwnProfile && (
            <button className="write-feed-button" onClick={() => navigate("/feed/write")}>
              ➕ 피드 작성하러 가기
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-container">
      {feeds.map((feed) => (
        <Link 
          to={`/feed/${feed.feedId}`} 
          key={feed.feedId} 
          style={{ textDecoration: "none" }} 
        >
          <img src={feed.image} alt={`Feed ${feed.feedId}`} className="gallery-image" />
        </Link>
      ))}
    </div>
  );
};

export default FeedList;
