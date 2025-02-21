package com.ssafy.foodthink.user.dto;

import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

@Getter
public class CustomOAuth2User implements OAuth2User {

    private final UserDto userDTO;
    private final boolean isNewUser; // 신규 사용자 여부
    private final Map<String, Object> attributes; // OAuth2 사용자 속성

    // 생성자
    public CustomOAuth2User(UserDto userDTO, boolean isNewUser, Map<String, Object> attributes) {
        this.userDTO = userDTO;
        this.isNewUser = isNewUser;
        this.attributes = attributes;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes; // OAuth2 사용자 속성 반환
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> collection = new ArrayList<>();
        collection.add(() -> userDTO.getRole()); // 사용자의 역할 추가
        return collection;
    }

    @Override
    public String getName() {
        return userDTO.getNickname(); // 닉네임을 이름으로 반환
    }

    public String getEmail() {
        return userDTO.getEmail();
    }

    public String getSocialId() {
        return userDTO.getSocialId();
    }
}
