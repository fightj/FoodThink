import React from "react"
import { useLocation } from "react-router-dom"
import "../../styles/login/LoginPage.css"

function LoginPage() {
  const location = useLocation()

  const handleKakaoClick = () => {
    console.log("Kakao login button clicked")
    window.location.href =
      "https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=71e6cc593f5444a36af1d3fe5dbb4f30&redirect_uri=http://i12e107.p.ssafy.io:8085/oauth2/authorization/kakao"
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
