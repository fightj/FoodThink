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


        // 생성된 refresh_token을 DB에 저장
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));

        Long userId = user.getUserId();

        String accessToken = jwtUtil.createAccessToken(userId, role, 60*60*60L);
        String refreshToken = jwtUtil.createRefreshToken(email, 60*60*60*24*7L); // 7일
        
        user.setRefreshToken(refreshToken);
        userRepository.save(user);

        log.info("[Slf4j]accessToken: " + accessToken);
        log.info("[Slf4j]refreshToken: " + refreshToken);

        // HTTP 응답의 본문(body)에 JSON 형태로 포함되어 클라이언트에게 전송
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write("{\"accessToken\":\"" + accessToken + "\"}");

        response.setStatus(HttpServletResponse.SC_OK);
    }

}
