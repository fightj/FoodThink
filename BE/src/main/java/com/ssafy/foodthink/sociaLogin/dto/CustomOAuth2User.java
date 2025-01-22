package com.ssafy.foodthink.sociaLogin.dto;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Map;

public class CustomOAuth2User implements OAuth2User {

    private final UserDto userDTO;

    public CustomOAuth2User(UserDto userDTO) {
        this.userDTO = userDTO;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return null;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // 로그인한 사용자에게 'ROLE_USER' 권한 부여
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getName() {
        return userDTO.getEmail();
    }

    // 로그인 상태 확인 메서드 추가
    public boolean isLoggedIn() {
        return true; // OAuth2User 객체가 생성되었다는 것은 이미 로그인된 상태
    }


}
