package com.ssafy.foodthink.sociaLogin.dto;

public interface OAuth2Response {
    String getProvider();
    String getProviderId();
    String getEmail();
    String getNickname();
}
