package com.ssafy.foodthink.sociaLogin.oauth2;

import com.ssafy.foodthink.sociaLogin.dto.CustomOAuth2User;
import com.ssafy.foodthink.sociaLogin.jwt.JWTUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Collection;
import java.util.Iterator;

@Component
@Slf4j
public class CustomSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JWTUtil jwtUtil;

    public CustomSuccessHandler(JWTUtil util) {
        this.jwtUtil = util;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        CustomOAuth2User customOAuth2User = (CustomOAuth2User) authentication.getPrincipal();

        String email = customOAuth2User.getEmail();
        String socialId = customOAuth2User.getSocialId();

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();
        String role = auth.getAuthority();

        String accessToken = jwtUtil.createAccessToken(email, role, 60*60*60L);
        String refreshToken = jwtUtil.createRefreshToken(email, 60*60*60*24*7L); // 7일

        log.info("[Slf4j]accessToken: " + accessToken);
        log.info("[Slf4j]refreshToken: " + refreshToken);

        response.addCookie(createCookie("Authorization", accessToken));
        response.addCookie(createCookie("Refresh", refreshToken));
        response.sendRedirect("http://localhost:8080/"); // 프론트 측 특정 url
    }

    private Cookie createCookie(String key, String value) {
        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(60*60*60);
        //cookie.setSecure(true); // HTTPS에서만 전송되도록 설정
        cookie.setPath("/"); // 모든 경로에서 사용 가능하도록 설정
        cookie.setHttpOnly(true); // JavaScript에서 접근할 수 없도록 설정

        return cookie;
    }
}
