package com.ssafy.foodthink.sociaLogin.dto;

public interface OAuth2Response {

    String getSocialType(); // provider(ex. kakao, google, naver)
    String getSocialId(); // provider에서 발급해주는 아이디
    String getEmail(); // 이메일

}
