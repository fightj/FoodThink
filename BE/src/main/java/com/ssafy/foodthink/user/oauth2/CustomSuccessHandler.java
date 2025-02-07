package com.ssafy.foodthink.user.oauth2;

import com.ssafy.foodthink.user.dto.CustomOAuth2User;
import com.ssafy.foodthink.user.entity.UserEntity;
import com.ssafy.foodthink.user.jwt.JWTUtil;
import com.ssafy.foodthink.user.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Slf4j
public class CustomSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    // JWTUtil을 의존성 주입받아 JWT 토큰 생성에 사용
    private final JWTUtil jwtUtil;
    private final UserRepository userRepository;

    public CustomSuccessHandler(JWTUtil util, UserRepository userRepository) {
        this.jwtUtil = util;
        this.userRepository = userRepository;
    }


    // 인증 성공 시 호출
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        CustomOAuth2User customOAuth2User = (CustomOAuth2User) authentication.getPrincipal();

        String email = customOAuth2User.getEmail();
        String role = customOAuth2User.getAuthorities().iterator().next().getAuthority();
        boolean isNewUser = customOAuth2User.isNewUser();

        log.info("=== 로그인 성공 ===");
        log.info("사용자 이메일: {}", customOAuth2User.getEmail());
        log.info("신규 사용자 여부: {}", isNewUser);

        // 사용자 조회
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));

        Long userId = user.getUserId();

        // 토큰 생성
        String accessToken = jwtUtil.createAccessToken(userId, role, 60 * 60 * 1000L); // 1시간
        String refreshToken = jwtUtil.createRefreshToken(email, 60*60*60*24*7L); // 7일

        // 리프레시 토큰 DB에 저장
        user.setRefreshToken(refreshToken);
        userRepository.save(user);

        log.info("accessToken: " + accessToken);
        log.info("refreshToken: " + refreshToken);

        // Authorization 헤더에 액세스 토큰 추가
        //response.setHeader("Authorization", "Bearer " + accessToken);
        
        // HttpOnly 쿠키에 액세스 토큰 저장
        //Cookie accessCookie = new Cookie("access_token", accessToken);
        //accessCookie.setHttpOnly(true); // JS 접근 불가
        //accessCookie.setSecure(true); // HTTPS 환경에서만 전송
        //accessCookie.setPath("/");
        //accessCookie.setMaxAge(60*60); // 1시간 유효
        //response.addCookie(accessCookie);

        //log.info("==액세스 토큰이 쿠키에 저장되었습니다.==");

        // 신규/기존 사용자 상태를 쿠키에 추가
//        Cookie statusCookie = new Cookie("user_status", isNewUser ? "NEW" : "EXISTING");
//        statusCookie.setHttpOnly(false); // JS에서 접근 가능
//        statusCookie.setPath("/");
//        statusCookie.setMaxAge(60 * 60);
//        response.addCookie(statusCookie);

        //log.info("==사용자의 상태가 쿠키에 저장되었습니다.==");

        //response.setHeader("USER-STATUS", isNewUser ? "NEW" : "EXISTING");

        // 프론트엔드 메인 페이지 URL로 리다이렉트
        //String redirectUrl = "http://localhost:5173/";
        //response.sendRedirect(redirectUrl);

        response.sendRedirect("http://localhost:5173/?accessToken=" + accessToken + "&isNewUser="+isNewUser);
    }

}
