package com.ssafy.foodthink.sociaLogin.controller;

import com.ssafy.foodthink.sociaLogin.jwt.JWTUtil;
import com.ssafy.foodthink.sociaLogin.service.CustomOAuth2UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private JWTUtil jwtUtil;

    @Autowired
    private CustomOAuth2UserService customOAuth2UserService;

    @GetMapping("/login/kakao")
    public ResponseEntity<?> kakaoLogin(OAuth2AuthenticationToken authenticationToken) {
        OAuth2User oauth2User = authenticationToken.getPrincipal();
        String email = oauth2User.getAttribute("email");
        String role = oauth2User.getAuthorities().iterator().next().getAuthority();

        String accessToken = jwtUtil.createAccessToken(email, role, 60*60*60L);

        return ResponseEntity.ok().body(accessToken);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            SecurityContextHolder.clearContext();
        }
        return ResponseEntity.ok().body("Logged out successfully");
    }
}
