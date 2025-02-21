package com.ssafy.foodthink.user.service;

import com.ssafy.foodthink.user.dto.KakaoTokenResponse;
import com.ssafy.foodthink.user.dto.KakaoUserInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
@RequiredArgsConstructor
public class KakaoService {

    @Value("${spring.security.oauth2.client.registration.kakao.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.kakao.redirect-uri}")
    private String redirectUri;

    private final RestTemplate restTemplate;

    /*
    2. 인가 코드로 카카오 액세스 토큰을 요청한다.
     */
    public KakaoTokenResponse getKakaoAccessToken(String code) {
        String tokenUrl = "https://kauth.kakao.com/oauth/token";
        log.info("kakao service, getkakaoaccesstoken");
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", clientId);
        params.add("redirect_uri", redirectUri);
        params.add("code", code);
        //params.add("scope", "account_email profile_nickname");


        log.info("인가코드:{}",code);
        log.info("Requesting Kakao access token with params: {}", params);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);
        log.info("request: {}", request );
//        KakaoTokenResponse response = restTemplate.postForObject(tokenUrl, request, KakaoTokenResponse.class);
//
//        log.info("response: {}", response);
//        //return restTemplate.postForObject(tokenUrl, request, KakaoTokenResponse.class);
//        if (response != null) {
//            log.info("Access Token: {}", response.getAccess_token());
//            //log.info("Refresh Token: {}", response.getRefresh_token());
//            log.info("Expires In: {}", response.getRefresh_token_expires_in());
//            log.info("Scope: {}", response.getScope());
//        } else {
//            log.error("Failed to retrieve access token.");
//        }
//
//        return response;

        try {
            log.info("요청 시도하기");
            return restTemplate.postForObject(tokenUrl, request, KakaoTokenResponse.class);
        } catch (HttpClientErrorException e) {
            log.error("카카오 액세스 토큰 요청 중 오류 발생: {}", e.getMessage());
            throw e;
        }

    }

    /*
    3. 카카오 액세스 토큰으로 사용자 정보를 요청한다.
     */
    public KakaoUserInfo getKakaoUserInfo(String accessToken) {
        log.info("사용자 정보 요청하기 ");
        String userInfoUrl = "https://kapi.kakao.com/v2/user/me";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        //return restTemplate.exchange(userInfoUrl, HttpMethod.GET, entity, KakaoUserInfo.class).getBody();

        try {
            ResponseEntity<KakaoUserInfo> response = restTemplate.exchange(userInfoUrl, HttpMethod.GET, entity, KakaoUserInfo.class);
            log.info("카카오 사용자 정보 요청 성공: {}", response.getBody());
            return response.getBody();
        } catch (HttpClientErrorException e) {
            log.error("카카오 사용자 정보 요청 오류: {}", e.getResponseBodyAsString());
            throw e;
        }
    }
}