package com.ssafy.foodthink.user.oauth2;

import com.ssafy.foodthink.user.dto.CustomOAuth2User;
import com.ssafy.foodthink.user.entity.UserEntity;
import com.ssafy.foodthink.user.jwt.JWTUtil;
import com.ssafy.foodthink.user.repository.UserRepository;
import jakarta.servlet.ServletException;
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

        log.info("=== 로그인 성공 ===");
        log.info("사용자 이메일: {}", customOAuth2User.getEmail());

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

        log.info("[Slf4j]accessToken: " + accessToken);
        log.info("[Slf4j]refreshToken: " + refreshToken);

        // HTTP 헤더에 액세스 토큰 추가
        response.setHeader("Authorization","Bearer "+accessToken);

        // 프론트엔드 메인 페이지로 리다이렉트
        String redirectUrl = "http://localhost:5173/";
        response.sendRedirect(redirectUrl);
    }

}
