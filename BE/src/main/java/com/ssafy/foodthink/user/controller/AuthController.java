package com.ssafy.foodthink.user.controller;

import com.ssafy.foodthink.user.entity.UserEntity;
import com.ssafy.foodthink.user.jwt.JWTUtil;
import com.ssafy.foodthink.user.repository.UserRepository;
import com.ssafy.foodthink.user.service.CustomOAuth2UserService;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private JWTUtil jwtUtil;

    @Autowired
    private CustomOAuth2UserService customOAuth2UserService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/login/kakao")
    public ResponseEntity<?> kakaoLogin(OAuth2AuthenticationToken authenticationToken) {
        OAuth2User oauth2User = authenticationToken.getPrincipal();
        String email = oauth2User.getAttribute("email");
        String role = oauth2User.getAuthorities().iterator().next().getAuthority();

        // 이메일로 사용자 조회
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));

        Long userId = user.getUserId();

        String accessToken = jwtUtil.createAccessToken(userId, role, 60 * 60 * 1000L);

        return ResponseEntity.ok().body(accessToken);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); // 현재 인증된 사용자의 정보를 가져옴

        // 사용자의 인증 정보를 제거
        if (auth != null) {
            SecurityContextHolder.clearContext();
        }
        return ResponseEntity.ok().body("사용자가 성공적으로 로그아웃되었습니다.");
    }
    
    // 리프레시 토큰으로 액세스 토큰 재발급
    @PostMapping("/reissue")
    public ResponseEntity<?> reissueAccessToken(@RequestHeader("Authorization") String bearerToken) {

        try {
            // "Bearer " 제거
            String accessToken = bearerToken.substring(7);

            // 액세스 토큰에서 사용자 ID 추출
            Long userId = jwtUtil.getUserIdFromExpiredToken(accessToken);

            // DB에서 사용자 조회
            UserEntity user = userRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));

            // DB에 저장된 리프레시 토큰 조회
            String refreshToken = user.getRefreshToken();

            // 리프레시 토큰 유효성 검사
            if (!jwtUtil.validateToken(refreshToken)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("유효하지 않은 리프레시 토큰");
            }

            // 새로운 액세스 토큰 생성
            String newAccessToken = jwtUtil.createAccessToken(user.getUserId(), user.getRole(), 60 * 60 * 1000L); // 1시간

            return ResponseEntity.ok().body(Map.of("accessToken", newAccessToken));
        } catch (ExpiredJwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "토큰이 만료되었습니다."));
        }

    }

}
