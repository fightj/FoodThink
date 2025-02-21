import React from "react"
import "../../styles/login/LoginPage.css"

function LoginPage() {
  const handleKakaoClick = () => {
    const kakaoClientId = import.meta.env.VITE_KAKAO_CLIENT_ID
    const kakaoRedirectId = import.meta.env.VITE_KAKAO_REDIRECT_URI
    console.log("Kakao login button clicked")
    window.location.href = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${kakaoClientId}&redirect_uri=${kakaoRedirectId}`
  }

  return (
    <div className="base-div">
      <div className="parent-container"> 
        <div className="card-div">
          <div className="content-wrapper">
            <h2>Food Think</h2>
            {/* <div className="image-wrapper">
              <img src="/images/꾸덕이.png" alt="Food Think Logo" className="main-image" />
            </div> */}
            <h3>지금 푸띵이와 요리를 시작하세요!</h3>

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
