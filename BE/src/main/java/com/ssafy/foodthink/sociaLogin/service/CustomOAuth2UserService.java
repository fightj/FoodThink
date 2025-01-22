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
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        log.info("[Slf4j]oAuth2User: {}", oAuth2User);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        if (!registrationId.equals("kakao")) {
            throw new OAuth2AuthenticationException("Unsupported OAuth2 provider");
        }

        KakaoResponse kakaoResponse = new KakaoResponse(oAuth2User.getAttributes());

        String socialId = kakaoResponse.getProviderId();
        String email = kakaoResponse.getEmail();
        String nickname = kakaoResponse.getNickname();

        Optional<UserEntity> existingUser = userRepository.findByEmail(email);

        UserEntity userEntity;
        if (existingUser.isEmpty()) {
            userEntity = UserEntity.createUser(socialId, email, nickname);
            userRepository.save(userEntity);
        } else {
            userEntity = existingUser.get();
            userEntity.setSocialId(socialId);
            userEntity.setNickname(nickname);
            userRepository.save(userEntity);
        }

        UserDto userDTO = new UserDto();
        userDTO.setEmail(email);
        userDTO.setNickname(nickname);
        userDTO.setRole(userEntity.getRole());
        userDTO.setSocialId(socialId);
        userDTO.setSocialType("KAKAO");

        return new CustomOAuth2User(userDTO);
    }
}