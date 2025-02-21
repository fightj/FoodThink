import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"
import "../../styles/base/global.css"

const LoginCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    // console.log("🔑 로그인 토큰 확인:", token);

    if (!token) {
      Swal.fire({
        title: "로그인이 필요합니다!",
        text: "서비스를 이용하려면 로그인하세요.",
        icon: "warning",
        customClass: {
          popup: "custom-swal-popup", // 공통 CSS 클래스 적용
        },
      }).then(() => {
        navigate("/login");
      });
    }
  }, [navigate]);

  return null; // UI 렌더링 없이 기능만 수행
};

export default LoginCheck;
