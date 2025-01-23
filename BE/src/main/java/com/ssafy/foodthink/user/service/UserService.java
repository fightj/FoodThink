package com.ssafy.foodthink.user.service;

import com.ssafy.foodthink.user.dto.UserDto;
import com.ssafy.foodthink.user.dto.UserInfoDto;
import com.ssafy.foodthink.user.entity.UserEntity;
import com.ssafy.foodthink.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

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

    public UserInfoDto updateUserNickname(Long userId, String nickname) {
        UserEntity userEntity = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없어요!!!"));

        if (nickname != null && !nickname.isEmpty()) {
            if (isNicknameDuplicate(nickname, userId)) {
                throw new RuntimeException("이미 사용 중인 닉네임입니다.");
            }
            userEntity.setNickname(nickname);
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

    private boolean isNicknameDuplicate(String nickname, Long userId) {
        Optional<UserEntity> existingUser = userRepository.findByNickname(nickname);
        return existingUser.isPresent() && !existingUser.get().getId().equals(userId);
    }
}

