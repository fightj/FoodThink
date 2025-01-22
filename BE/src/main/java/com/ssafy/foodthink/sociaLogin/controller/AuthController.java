package com.ssafy.foodthink.sociaLogin.controller;

import com.ssafy.foodthink.sociaLogin.dto.CustomOAuth2User;
import com.ssafy.foodthink.sociaLogin.dto.UserDto;
import com.ssafy.foodthink.sociaLogin.jwt.JWTUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Map;

@Controller
@RequiredArgsConstructor
public class AuthController {

    private final JWTUtil jwtUtil;

    @GetMapping("/")
    @ResponseBody
    public String mainAPI() {
        return "메인 페이지입니다.";
    }

    @GetMapping("/my")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> myAPI(@AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        Map<String, Object> response = new HashMap<>();
        if (customOAuth2User != null) {
            UserDto userDTO = new UserDto();
            userDTO.setEmail(customOAuth2User.getEmail());
            userDTO.setNickname(customOAuth2User.getName());
            userDTO.setRole(customOAuth2User.getAuthorities().iterator().next().getAuthority());
            userDTO.setSocialId(customOAuth2User.getSocialId());
            userDTO.setSocialType("KAKAO");

            response.put("user", userDTO);
            return ResponseEntity.ok(response);
        } else {
            response.put("error", "사용자 정보를 찾을 수 없습니다.");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {
        // 쿠키에서 JWT 토큰 제거
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("Authorization") || cookie.getName().equals("Refresh")) {
                    cookie.setValue("");
                    cookie.setPath("/");
                    cookie.setMaxAge(0);
                    response.addCookie(cookie);
                }
            }
        }
        return ResponseEntity.ok("로그아웃 되었습니다.");
    }
}
