import { useEffect, useState } from "react"
import axios from "axios"

const AnniversaryApiModal = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [message, setMessage] = useState("특별한 기념일이 없습니다") // 기본 메시지 설정

  useEffect(() => {
    const showModal = localStorage.getItem("showModal")
    const showModalUntil = localStorage.getItem("showModalUntil")

    if (!showModal || new Date(showModalUntil) < new Date()) {
      axios
        .get("https://i12e107.p.ssafy.io/api/today-recommend/anniversary", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (response.data.available) {
            setMessage(response.data.message)
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            // 401 에러 발생 시, 콘솔에는 출력하지 않고 기본 메시지 유지
          }
          setMessage("특별한 기념일이 없습니다")
        })
        .finally(() => {
          setModalOpen(true) // API 응답과 관계없이 모달을 열기
        })
    }
  }, [])

  const handleClose = (days) => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + days)
    localStorage.setItem("showModal", "false")
    localStorage.setItem("showModalUntil", futureDate)
    setModalOpen(false)
  }

  return (
    <div>
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <p>{message}</p>
            <button onClick={() => handleClose(1)}>하루 동안 보지 않기</button>
            <button onClick={() => handleClose(7)}>일주일 동안 보지 않기</button>
            <button onClick={() => setModalOpen(false)}>닫기</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnniversaryApiModal
