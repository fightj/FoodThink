import React, { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import "../../styles/login/LoginPage.css"

// async function fetchAccessToken(code) {
//   try {
//     const response = await fetch(`http://localhost:8080/api/auth/login/kakao?code=${code}`, {
//       method: "GET",
//       credentials: "include",
//     })

//     if (response.ok) {
//       const accessToken = await response.text() // response.json() 대신 response.text() 사용
//       return accessToken
//     } else {
//       console.error("Failed to fetch access token.")
//       return null
//     }
//   } catch (error) {
//     console.error("Error fetching access token:", error)
//     return null
//   }
// }

function LoginPage() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    console.log("useEffect triggered")
    const searchParams = new URLSearchParams(location.search)
    const code = searchParams.get("code")

    console.log("Authorization code from URL:", code)

    if (code) {
      console.log("Authorization code is present")
      fetchAccessToken(code).then((accessToken) => {
        if (accessToken) {
          console.log("Access Token:", accessToken)

          // 액세스 토큰을 로컬 스토리지에 저장
          localStorage.setItem("accessToken", accessToken)

          // 로그인 성공 메시지 출력
          console.log("로그인 성공")

          // 메인 페이지로 리디렉트
          navigate("/")
        } else {
          console.log("Failed to retrieve access token")
        }
      })
    } else {
      console.log("Authorization code is not present")
    }
  }, [location, navigate])

  const handleKakaoClick = () => {
    console.log("Kakao login button clicked")
    window.location.href =
      "https://accounts.kakao.com/login/?continue=https%3A%2F%2Fkauth.kakao.com%2Foauth%2Fauthorize%3Fresponse_type%3Dcode%26client_id%3D71e6cc593f5444a36af1d3fe5dbb4f30%26redirect_uri%3Dhttp%253A%252F%252Fi12e107.p.ssafy.io%253A8085%252Foauth2%252Fauthorization%252Fkakao%26through_account%3Dtrue#login"
  }

  return (
    <div className="base-div">
      <div className="parent-container">
        <div className="card-div">
          <div className="content-wrapper">
            <h2>Food Think</h2>
            <div className="image-wrapper">
              <img src="/images/login-page-img.png" alt="Food Think Logo" className="main-image" />
              <img src="/images/mainlogo.jpg" alt="Food Think Logo" className="overlay-image" />
            </div>
            <h1>지금 Food Think와 요리를 시작하세요!</h1>
            <br />
            <br />
            <div className="start-now">
              <p>3초만에 시작하기!</p>
            </div>
            <div className="social-login-buttons">
              <button className="social-button" onClick={handleKakaoClick}>
                <img src="/images/카카오.png" alt="Kakao" />
              </button>
              {/* 다른 소셜 로그인 버튼 */}
              <button className="social-button">
                <img src="/images/네이버.png" alt="Naver" />
              </button>
              <button className="social-button">
                <img src="/images/구글.png" alt="Google" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
