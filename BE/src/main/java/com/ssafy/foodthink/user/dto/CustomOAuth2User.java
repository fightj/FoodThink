package com.ssafy.foodthink.user.dto;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.ArrayList;
import java.util.Collection;
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
        Collection<GrantedAuthority> collection = new ArrayList<>();
        collection.add(() -> userDTO.getRole());
        return collection;
    }

    @Override
    public String getName() {
        return userDTO.getNickname();
    }

    public String getEmail() {
        return userDTO.getEmail();
    }

    public String getSocialId() {
        return userDTO.getSocialId();
    }
}
