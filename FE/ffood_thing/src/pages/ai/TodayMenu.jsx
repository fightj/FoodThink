import React, { useEffect, useState } from "react";

const TodayMenu = () => {
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/today-menu");
        const data = await response.json();
        setMenu(data.recommendedMenu);
      } catch (error) {
        console.error("📌 오늘의 메뉴를 가져오는 중 오류 발생:", error);
      }
      setLoading(false);
    };

    fetchMenu();
  }, []);

  return (
    <div>
      <h2>🍽️ 오늘의 추천 메뉴</h2>
      {loading ? (
        <p>⏳ 로딩 중...</p>
      ) : (
        <div>
          <p>🍜 추천 메뉴: <strong>{menu}</strong></p>
        </div>
      )}
    </div>
  );
};

export default TodayMenu;
