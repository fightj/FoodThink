import React from "react"
import "../../styles/login/LoginPage.css"

function LoginPage() {
  return (
    <div className="base-div">
      <div className="card-div-login">
        <div className="content-wrapper">
          <h2>Food Think</h2>
          <div className="image-wrapper">
            <img src="/images/login-page-img.png" alt="Food Think Logo" className="main-image" />
            <img src="/images/mainlogo.jpg" alt="Food Think Logo" className="overlay-image" />
          </div>
          <h1>지금 Food Think와</h1>
          <h1>요리를 시작하세요!</h1>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
