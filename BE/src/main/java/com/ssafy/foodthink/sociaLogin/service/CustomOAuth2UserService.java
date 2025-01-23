package com.ssafy.foodthink.sociaLogin.service;

import com.ssafy.foodthink.sociaLogin.dto.CustomOAuth2User;
import com.ssafy.foodthink.sociaLogin.dto.KakaoResponse;
import com.ssafy.foodthink.sociaLogin.dto.UserDto;
import com.ssafy.foodthink.sociaLogin.entity.UserEntity;
import com.ssafy.foodthink.sociaLogin.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional(readOnly = true)
@Slf4j
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {  // OAuth2 인증 과정에서 사용자 정보를 로드 및 처리
        OAuth2User oAuth2User = super.loadUser(userRequest);
        log.info("[Slf4j]oAuth2User: {}", oAuth2User);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        if (!registrationId.equals("kakao")) { // kakao 로그인만
            throw new OAuth2AuthenticationException("이외의 provider인 경우 !!!!");
        }

        // Kakao에서 제공한 사용자 정보를 파싱
        KakaoResponse kakaoResponse = new KakaoResponse(oAuth2User.getAttributes());

        String socialId = kakaoResponse.getProviderId();
        String email = kakaoResponse.getEmail();
        String nickname = kakaoResponse.getNickname();

        // 이메일로 기존 사용자 조회
        Optional<UserEntity> existingUser = userRepository.findByEmail(email);

        UserEntity userEntity;
        if (existingUser.isEmpty()) { // 신규사용자인 경우
            userEntity = UserEntity.createUser(socialId, email, nickname);
            userRepository.save(userEntity);
        } else { // 기존 사용자인 경우
            userEntity = existingUser.get();
        }

        // 기존 사용자의 경우 데이터베이스에 저장된 정보를 그대로 사용, 새로운 사용자만 정보가 저장
        UserDto userDTO = new UserDto();
        userDTO.setEmail(userEntity.getEmail());
        userDTO.setNickname(userEntity.getNickname());
        userDTO.setRole(userEntity.getRole());
        userDTO.setSocialId(userEntity.getSocialId());
        userDTO.setSocialType("KAKAO");

        return new CustomOAuth2User(userDTO);
    }
}