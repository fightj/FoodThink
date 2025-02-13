package com.ssafy.foodthink.user.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class KakaoUserInfo {
    private String id;
    private Properties properties;
    private KakaoAccount kakao_account;

    @Getter
    @Setter
    public static class Properties {
        private String nickname;
    }

    @Getter
    @Setter
    public static class KakaoAccount {
        private String email;
    }

    public String getNickname() {
        return properties != null ? properties.getNickname() : null;
    }

    public String getEmail() {
        return kakao_account != null ? kakao_account.getEmail() : null;
    }
}