import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import qs from "qs"; // 쿼리 스트링 라이브러리 추가

function KakaoCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAccessToken = async () => {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const code = urlParams.get("code");

                if (!code) {
                    console.error("Error: 인가 코드가 없습니다.");
                    alert("인가 코드가 없습니다. 다시 시도해주세요.");
                    navigate("/login");
                    return;
                }

                // 중복 요청 방지
                if (localStorage.getItem("kakaoAuthProcessed")) {
                    console.warn("이미 처리된 인가 코드입니다. 중복 요청 방지.");
                    return;
                }
                localStorage.setItem("kakaoAuthProcessed", "true"); // 요청 전에 플래그 설정

                console.log("인가코드 전달 중:", code);

                const response = await axios.post(
                    "http://localhost:8080/api/auth/kakao",
                    qs.stringify({ code }),
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                    }
                );

                console.log("응답 데이터:", response);

                if (response.status >= 200 && response.status < 300) {
                    const accessToken = response.headers["authorization"]?.split(" ")[1];
                    const { email, isNewUser } = response.data;

                    if (accessToken) localStorage.setItem("accessToken", accessToken);
                    if (email) sessionStorage.setItem("email", email);
                    if (isNewUser !== undefined) sessionStorage.setItem("isNewUser", isNewUser);

                    console.log("로그인 성공:", { accessToken, email, isNewUser });
                    localStorage.removeItem("kakaoAuthProcessed");
                    navigate("/");
                } else {
                    console.error("Error: 응답 상태 코드:", response.status);
                    alert("카카오 로그인에 실패했습니다.");
                    navigate("/login");
                }
            } catch (error) {
                console.error("Error during Kakao login callback:", error.response || error.message);
                alert("카카오 로그인에 실패했습니다. 다시 시도해주세요.");
                navigate("/login");
            }
        };

        fetchAccessToken();
    }, [navigate]); 

    return <div>카카오 로그인 처리 중...</div>;
}

export default KakaoCallback;
