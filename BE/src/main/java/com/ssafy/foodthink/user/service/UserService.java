package com.ssafy.foodthink.user.service;

import com.ssafy.foodthink.user.dto.UserDto;
import com.ssafy.foodthink.user.dto.UserInfoDto;
import com.ssafy.foodthink.user.entity.UserEntity;
import com.ssafy.foodthink.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserInfoDto getUserById(Long userId) {
        UserEntity userEntity = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없어요!!!"));

        return convertToDto(userEntity);
    }

    public UserInfoDto updateUserInfo(Long userId, String nickname, String image) {
        UserEntity userEntity = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없어요!!!"));

        if (nickname != null && !nickname.isEmpty()) {
            userEntity.setNickname(nickname);
        }
        if (image != null && !image.isEmpty()) {
            userEntity.setImage(image);
        }

        userRepository.save(userEntity);

        return convertToDto(userEntity);
    }

    public void deleteUser(Long userId) {
        UserEntity userEntity = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        userRepository.delete(userEntity);
    }

    private UserInfoDto convertToDto(UserEntity userEntity) {
        return UserInfoDto.builder()
                .email(userEntity.getEmail())
                .nickname(userEntity.getNickname())
                .image(userEntity.getImage())
                .build();
    }
}

