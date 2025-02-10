import React, { useEffect } from "react";
import "../../styles/profile/SubscriberModal.css";

const SubscriberModal = ({ subscribers, onClose }) => {
  // ✅ 모달이 열릴 때 스크롤 막기
  useEffect(() => {
    document.body.style.overflow = "hidden"; // 스크롤 막기
    return () => {
      document.body.style.overflow = "auto"; // 모달 닫을 때 원상 복구
    };
  }, []);

  return (
    <div className="subscriber-modal-overlay" onClick={onClose}> {/* ✅ 배경 클릭 시 닫힘 */}
      <div className="subscriber-modal" onClick={(e) => e.stopPropagation()}> {/* ✅ 내부 클릭 시 닫히지 않음 */}
        <h4>🔖 구독 리스트</h4>
        <button className="close-btn" onClick={onClose}>×</button>
        <ul className="subscriber-list">
          {subscribers.length > 0 ? (
            subscribers.map((subscriber) => (
              <li key={subscriber.id} className="subscriber-item">
                <img src={subscriber.profileImg} alt={subscriber.nickname} className="subscriber-avatar" />
                <span className="subscriber-nickname">{subscriber.nickname}</span>
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
