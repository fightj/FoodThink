package com.ssafy.foodthink.user.service;

import com.ssafy.foodthink.user.dto.UserDto;
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

    public UserDto getUserById(Long userId) {
        UserEntity userEntity = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없어요!!!"));

        return convertToDto(userEntity);
    }

    private UserDto convertToDto(UserEntity userEntity) {
        return UserDto.builder()
                .email(userEntity.getEmail())
                .nickname(userEntity.getNickname())
                .role(userEntity.getRole())
                .socialId(userEntity.getSocialId())
                .socialType(userEntity.getSocialType())
                .image(userEntity.getImage())
                .build();
    }
}

