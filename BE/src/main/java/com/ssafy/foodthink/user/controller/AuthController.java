package com.ssafy.foodthink.user.controller;

import com.ssafy.foodthink.user.dto.CustomOAuth2User;
import com.ssafy.foodthink.user.dto.KakaoTokenResponse;
import com.ssafy.foodthink.user.dto.KakaoUserInfo;
import com.ssafy.foodthink.user.entity.UserEntity;
import com.ssafy.foodthink.user.jwt.JWTUtil;
import com.ssafy.foodthink.user.repository.UserRepository;
import com.ssafy.foodthink.user.service.CustomOAuth2UserService;
import com.ssafy.foodthink.user.service.KakaoService;
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

import java.util.HashMap;
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
    @Autowired
    private KakaoService kakaoService;

    private boolean isNewUser;

    /*
    1. 카카오 로그인 요청 후 발급된 인가 코드를 받는다.
    4. 사용자 정보로 회원 확인
    5. 액세스 토큰 생성
    6. "액세스 토큰, 이메일, 신규사용자 여부"를 반환
     */
    @PostMapping("/kakao")
    public ResponseEntity<?> kakaoLogin(@RequestBody MultiValueMap<String, String> requestBody) {
        String code = requestBody.getFirst("code"); // JSON에서 code 추출

        if (code == null || code.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "type", "about:blank",
                    "title", "Bad Request",
                    "status", 400,
                    "detail", "Required parameter 'code' is not present.",
                    "instance", "/api/auth/kakao"
            ));
        }
        log.info("==controller 인가코드:{}==",code);
        try {
            // 인가 코드로 액세스 토큰 요청
            KakaoTokenResponse tokenResponse = kakaoService.getKakaoAccessToken(code);
            log.info("==인카코드로 액세스 토큰 요청:{}==",tokenResponse);

            // 액세스 토큰으로 사용자 정보 요청
            KakaoUserInfo userInfo = kakaoService.getKakaoUserInfo(tokenResponse.getAccess_token());
            log.info("==액세스 토큰으로 사용자 정보 요청:{}==",userInfo);

            // 회원 확인 및 처리
            UserEntity user = userRepository.findByEmail(userInfo.getEmail())
                    .orElseGet(() -> {
                        UserEntity newUser = new UserEntity();
                        newUser.setEmail(userInfo.getEmail());
                        newUser.setNickname(userInfo.getNickname());
                        newUser.setSocialId(userInfo.getId());
                        newUser.setSocialType("KAKAO");
                        newUser.setRole("ROLE_USER");
                        isNewUser = true;
                        return userRepository.save(newUser);
                    });

            log.info("==회원 확인 및 처리:{}==",user.getSocialId());

            // JWT 생성
            String accessToken = jwtUtil.createAccessToken(user.getUserId(), user.getRole(), 24 * 60 * 60 * 1000L);
            String refreshToken = jwtUtil.createRefreshToken(user.getEmail(), 7 * 24 * 60 * 60 * 1000L);

            user.setRefreshToken(refreshToken);
            userRepository.save(user);

            // 액세스 토큰은 헤더로 이메일,신규사용자 여부는 body로
            HttpHeaders headers = new HttpHeaders();
            headers.add("Authorization", "Bearer " + accessToken);

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("email", user.getEmail());
            responseBody.put("nickname", user.getNickname());
            responseBody.put("userId", user.getUserId());
            responseBody.put("image",user.getImage());
            responseBody.put("season",user.getSeason());
            responseBody.put("isNewUser", isNewUser);

            log.info("==로그인 성공!!!!!==");
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(responseBody);

            // 전부 쿠키로 전달
              // 액세스 토큰을 쿠키에 저장
//            Cookie accessTokenCookie = new Cookie("accessToken", accessToken);
//            accessTokenCookie.setHttpOnly(true);
//            accessTokenCookie.setSecure(true); // HTTPS에서만 사용
//            accessTokenCookie.setMaxAge(3600); // 1시간
//            accessTokenCookie.setPath("/");
//            response.addCookie(accessTokenCookie);
//
              // 사용자 정보를 쿠키에 저장
//            Cookie emailCookie = new Cookie("email", user.getEmail());
//            emailCookie.setMaxAge(3600);
//            emailCookie.setPath("/");
//            response.addCookie(emailCookie);
              //
//            Cookie isNewUserCookie = new Cookie("isNewUser", String.valueOf(isNewUser));
//            isNewUserCookie.setMaxAge(3600);
//            isNewUserCookie.setPath("/");
//            response.addCookie(isNewUserCookie);
//
//            return ResponseEntity.ok().body("로그인 성공");

            // 전부 헤더로 전달
//            HttpHeaders headers = new HttpHeaders();
//            headers.add("Authorization", "Bearer " + accessToken);
//            headers.add("email", user.getEmail());
//            headers.add("isNewUser", String.valueOf(isNewUser));
//
//            log.info("로그인 성공!!!!!");
//            return ResponseEntity.ok().headers(headers).build();

        } catch (Exception e) {
            log.error("==카카오 로그인 실패==", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("카카오 로그인 실패");
        }
    }

    // 카카오 계정 로그아웃이 아닌 푸띵 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String token, HttpServletResponse response) {
        try {
            String accessToken = token.replace("Bearer ", "");
            Long userId = jwtUtil.getUserId(accessToken);

            // DB에서 사용자 조회
            UserEntity user = userRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));

            // 리프레시 토큰 삭제
            user.setRefreshToken(null);
            userRepository.save(user);

//            // HttpOnly 액세스 토큰 쿠키 삭제
//            Cookie accessCookie = new Cookie("access_token", null);
//            //accessCookie.setHttpOnly(true); // HttpOnly 설정
//            //accessCookie.setSecure(true);  // HTTPS 환경에서만 전송
//            accessCookie.setPath("/");
//            accessCookie.setMaxAge(0); // 즉시 만료
//            response.addCookie(accessCookie);

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
            String newAccessToken = jwtUtil.createAccessToken(user.getUserId(), user.getRole(), 24 * 60 * 60 * 1000L);

            log.info("=== 액세스 토큰 재발급 성공 ===");

            // Authorization 헤더에 새 액세스 토큰 추가
            //response.setHeader("Authorization", "Bearer "+newAccessToken);

            // 새로 발급된 액세스 토큰을 HttpOnly 쿠키에 저장
//            Cookie accessCookie = new Cookie("access_token", newAccessToken);
//            //accessCookie.setHttpOnly(true);
//            //accessCookie.setSecure(true);
//            accessCookie.setPath("/");
//            accessCookie.setMaxAge(60 * 60);
//            response.addCookie(accessCookie);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + newAccessToken); // Authorization 헤더에 추가

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(Map.of("message", "액세스 토큰이 성공적으로 발급되었습니다."));
        } catch (ExpiredJwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "토큰이 만료되었어요."));
        } catch(Exception e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "토큰 재발급에 실패했어요."));
        }

    }

}