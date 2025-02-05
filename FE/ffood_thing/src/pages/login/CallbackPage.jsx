import React, { useEffect } from "react"
import { useLocation } from "react-router-dom"

function CallbackPage() {
  const location = useLocation()

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const code = searchParams.get("code")

    if (code) {
      // 인가 코드를 백엔드로 전달
      fetch(`http://localhost:8080/auth/kakao?code=${code}`, {
        method: "GET",
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          const accessToken = data.accessToken
          console.log("Access Token:", accessToken)

          // 액세스 토큰을 로컬 스토리지에 저장
          localStorage.setItem("accessToken", accessToken)

          // 유저 정보를 가져와 콘솔에 출력
          fetchUserData(accessToken)

          // 홈 페이지로 이동
          window.location.href = "/"
        })
        .catch((error) => {
          console.error("Error:", error)
        })
    }
  }, [location])

  return (
    <div>
      <h2>로딩 중...</h2>
    </div>
  )
}

export default CallbackPage
