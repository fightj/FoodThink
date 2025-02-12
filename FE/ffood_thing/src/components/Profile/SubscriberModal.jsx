import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/profile/SubscriberModal.css";

const SubscriberModal = ({ subscribers = [], onClose }) => {
  const navigate = useNavigate();
  useEffect(() => {
    document.body.style.overflow = "hidden"; // 스크롤 막기
    return () => {
      document.body.style.overflow = "auto"; // 모달 닫을 때 원상 복구
    };
  }, []);

  // ✅ 특정 구독자의 프로필 페이지로 이동하는 함수
  const goToProfile = (nickname) => {
    navigate(`/profile/${nickname}`); // 🚀 해당 사용자의 프로필 페이지로 이동
    onClose(); // ✅ 모달 닫기
  };

  return (
    <div className="subscriber-modal-overlay" onClick={onClose}>
      <div className="subscriber-modal" onClick={(e) => e.stopPropagation()}>
        <h4>🔖 구독 리스트</h4>
        <button className="close-btn" onClick={onClose}>×</button>
        <ul className="subscriber-list">
          {subscribers.length > 0 ? (
            subscribers.map((subscriber) => (
              <li key={subscriber.userId} className="subscriber-item" onClick={() => goToProfile(subscriber.nickname)}>
                <img
                  src={subscriber.image || "/images/default_profile.png"}
                  alt={subscriber.nickname || "익명"}
                  className="subscriber-avatar"
                />
                <span className="subscriber-nickname">{subscriber.nickname || "익명"}</span>
              </li>
            ))
          ) : (
            <div className="no-subscriber-text">아직 구독자가 없습니다. 😢</div>
          )}
        </ul>
      </div>
    </div>
  );
};


export default SubscriberModal;
