package com.ssafy.foodthink.user.controller;

import com.ssafy.foodthink.user.dto.CustomOAuth2User;
import com.ssafy.foodthink.user.entity.UserEntity;
import com.ssafy.foodthink.user.jwt.JWTUtil;
import com.ssafy.foodthink.user.repository.UserRepository;
import com.ssafy.foodthink.user.service.CustomOAuth2UserService;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private JWTUtil jwtUtil;

    @Autowired
    private CustomOAuth2UserService customOAuth2UserService;

    @Autowired
    private UserRepository userRepository;

    // 쿠키에 토큰이 제대로 저장되었는지 확인
    @GetMapping("/token")
    public ResponseEntity<?> getAccessToken(HttpServletRequest request){
        Cookie[] cookies = request.getCookies();
        if(cookies == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "쿠키에서 토큰을 찾을 수 없어요"));
        }
        for(Cookie cookie : cookies){
            if("access_token".equals(cookie.getName())){
                String accessToken = cookie.getValue();
                try{
                    Long userId = jwtUtil.getUserId(accessToken);
                    String role = jwtUtil.getRole(accessToken);

                    return ResponseEntity.ok()
                            .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                            .body(Map.of(
                                    "message", "토큰 교환 성공",
                                    "userId", userId,
                                    "role", role
                            ));
                } catch (ExpiredJwtException e) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(Map.of("message", "토큰이 만료되었습니다"));
                }
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message","유효한 액세스 토큰이 없어요"));
    }

    // 카카오 계정 로그아웃이 아닌 푸띵 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String token) {
        try {
            String accessToken = token.replace("Bearer ", "");
            Long userId = jwtUtil.getUserId(accessToken);

            // DB에서 사용자 조회
            UserEntity user = userRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));

            // 리프레시 토큰 삭제
            user.setRefreshToken(null);
            userRepository.save(user);

            // 인증 정보 제거
            SecurityContextHolder.clearContext();

            log.info("=== 로그아웃 성공 ===");

            return ResponseEntity.ok().body("사용자가 성공적으로 로그아웃되었습니다.");
        } catch (ExpiredJwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("토큰이 만료되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("유효하지 않은 액세스 토큰입니다.");
        }
    }

    // 리프레시 토큰으로 액세스 토큰 재발급
    @PostMapping("/reissue")
    public ResponseEntity<?> reissueAccessToken(@RequestHeader("Authorization") String bearerToken, HttpServletResponse response) {

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
            if (refreshToken == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("리프레시 토큰이 존재하지 않아요");
            }

            // 리프레시 토큰 유효성 검사
            if (!jwtUtil.validateToken(refreshToken)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("유효하지 않은 리프레시 토큰");
            }

            // 새로운 액세스 토큰 생성
            String newAccessToken = jwtUtil.createAccessToken(user.getUserId(), user.getRole(), 60 * 60 * 1000L); // 1시간

            log.info("=== 액세스 토큰 재발급 성공 ===");

            // 새 액세스 토큰을 쿠키에 저장
            Cookie newAccessCookie = new Cookie("access_token", newAccessToken); // 기존의 액세스 토큰을 새 액세스 토큰으로 대체
            newAccessCookie.setHttpOnly(true);
            //newAccessCookie.setSecure(true); // HTTPS 환경에서만 사용
            newAccessCookie.setPath("/");
            newAccessCookie.setMaxAge(60 * 60); // 1시간
            response.addCookie(newAccessCookie);

            return ResponseEntity.ok().body(Map.of("message", "액세스 토큰이 성공적으로 재발급되었어요."));
        } catch (ExpiredJwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "토큰이 만료되었습니다."));
        }

    }

}
