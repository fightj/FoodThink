package com.ssafy.foodthink.user.jwt;

import com.ssafy.foodthink.global.exception.InvalidTokenException;
import com.ssafy.foodthink.user.dto.CustomOAuth2User;
import com.ssafy.foodthink.user.dto.UserDto;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.HashMap;

@Slf4j
public class JWTFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;

    public JWTFilter(JWTUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            String token = extractToken(request); // request에서 토큰을 추출

            // 유효한 토큰이 존재하는 경우
            if (token != null && jwtUtil.validateToken(token)) {
                String email = jwtUtil.getEmail(token);
                String role = jwtUtil.getRole(token);

                UserDto userDTO = new UserDto();
                userDTO.setEmail(email);
                userDTO.setRole(role);
                userDTO.setSocialType("KAKAO");

                // CustomOAuth2User 생성
                CustomOAuth2User customOAuth2User = new CustomOAuth2User(
                        userDTO,
                        false, // JWT를 통해 인증된 사용자는 신규 사용자가 아님
                        new HashMap<>()
                );

                Authentication auth = new UsernamePasswordAuthenticationToken(customOAuth2User, null, customOAuth2User.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(auth);
            }

            filterChain.doFilter(request, response);
        } catch (InvalidTokenException e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            String jsonResponse = "{\"available\": false, \"message\": \"토큰이 만료되었습니다.\"}";
            response.getWriter().write(jsonResponse);
        }

    }

    private String extractToken(HttpServletRequest request) {

        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }


    // 리프레시 토큰 재발급 경로 제외
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.startsWith("/auth/reissue");
    }

}
