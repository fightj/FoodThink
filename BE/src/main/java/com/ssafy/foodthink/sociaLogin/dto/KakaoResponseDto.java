package com.ssafy.foodthink.sociaLogin.dto;

import java.util.Map;

public class KakaoResponseDto implements OAuth2Response{

    private final Map<String, Object> attribute;

    public KakaoResponseDto(Map<String, Object> attribute) {

        this.attribute= attribute;

    }

    @Override
    public String getSocialType() {


        return "kakao";
    }

    @Override
    public String getSocialId() {
        return attribute.get("id").toString();
    }

    @Override
    public String getEmail() {
        // kakao_account 안에 있는 email 값 가져오기
        Map<String, Object> kakaoAccount = (Map<String, Object>) attribute.get("kakao_account");
        return kakaoAccount.get("email").toString();
    }


}
