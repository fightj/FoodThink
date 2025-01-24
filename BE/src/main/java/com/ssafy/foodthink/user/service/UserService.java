package com.ssafy.foodthink.user.service;

import com.ssafy.foodthink.global.S3Service;
import com.ssafy.foodthink.global.exception.AleadyExistsException;
import com.ssafy.foodthink.user.dto.UserInfoDto;
import com.ssafy.foodthink.user.entity.UserEntity;
import com.ssafy.foodthink.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final S3Service s3Service;

    @Autowired
    public UserService(UserRepository userRepository, S3Service s3Service) {
        this.userRepository = userRepository;
        this.s3Service = s3Service;
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
                throw new AleadyExistsException("이미 사용 중인 닉네임입니다.");
            }
            userEntity.setNickname(nickname);
        }

        userRepository.save(userEntity);

        return convertToDto(userEntity);
    }

    public UserInfoDto updateUserImage(Long userId, MultipartFile image){
        UserEntity userEntity = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없어요!!!"));


        if(image != null && !image.isEmpty()){
            String imageUrl = s3Service.uploadFile(image);
            userEntity.setImage(imageUrl);
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

