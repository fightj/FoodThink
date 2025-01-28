package com.ssafy.foodthink.user.service;

import com.ssafy.foodthink.global.S3Service;
import com.ssafy.foodthink.global.exception.AleadyExistsException;
import com.ssafy.foodthink.user.dto.UserInfoDto;
import com.ssafy.foodthink.user.dto.UserInterestDto;
import com.ssafy.foodthink.user.entity.UserEntity;
import com.ssafy.foodthink.user.entity.UserInterestEntity;
import com.ssafy.foodthink.user.repository.UserInterestRepository;
import com.ssafy.foodthink.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserInterestRepository userInterestRepository;
    private final S3Service s3Service;

    @Autowired
    public UserService(UserRepository userRepository, UserInterestRepository userInterestRepository, S3Service s3Service) {
        this.userRepository = userRepository;
        this.userInterestRepository = userInterestRepository;
        this.s3Service = s3Service;
    }

    // userid로 회원 찾기
    public UserInfoDto readUserByUserId(Long userId) {
        UserEntity userEntity = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없어요!!!"));

        return convertToDto(userEntity);
    }

    // 회원 닉네임 수정
    public UserInfoDto updateUserNickname(Long userId, String nickname) {
        UserEntity userEntity = userRepository.findByUserId(userId)
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

    // 회원 프로필 사진 수정
    public UserInfoDto updateUserImage(Long userId, MultipartFile image){
        UserEntity userEntity = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없어요!!!"));


        if(image != null && !image.isEmpty()){
            String imageUrl = s3Service.uploadFile(image);
            userEntity.setImage(imageUrl);
        }
        userRepository.save(userEntity);

        return convertToDto(userEntity);
    }

    // 회원 탈퇴
    public void deleteUser(Long userId) {
        UserEntity userEntity = userRepository.findByUserId(userId)
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

    // 닉네임 중복 확인
    private boolean isNicknameDuplicate(String nickname, Long userId) {
        Optional<UserEntity> existingUser = userRepository.findByNickname(nickname);
        return existingUser.isPresent() && !existingUser.get().getUserId().equals(userId);
    }

    // 회원 관심사 조회
    public List<UserInterestDto> readUserInterest(Long userId) {
        UserEntity user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없어요!!!"));

        List<UserInterestEntity> interests = userInterestRepository.findByUserId(user);
        return interests.stream()
                .map(this::convertToInterestDto)
                .collect(Collectors.toList());
    }

    // 회원 관심사 여러개 추가
    @Transactional
    public List<UserInterestDto> createUserInterests(Long userId, List<UserInterestDto> interestDtoList) {
        UserEntity user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없어요!!!"));

        List<UserInterestEntity> interests = interestDtoList.stream()
                .map(dto -> UserInterestEntity.createInterest(
                        dto.getIngredient(),
                        dto.getIsLiked(),
                        user
                ))
                .collect(Collectors.toList());

        List<UserInterestEntity> savedInterests = userInterestRepository.saveAll(interests);
        return savedInterests.stream()
                .map(this::convertToInterestDto)
                .collect(Collectors.toList());
    }

    // 회원 관심사 삭제
    @Transactional
    public void deleteUserInterest(Long interestId) {
        UserInterestEntity interest = userInterestRepository.findById(interestId)
                .orElseThrow(() -> new RuntimeException("관심사를 찾을 수 없습니다."));

        userInterestRepository.delete(interest);
    }

    private UserInterestDto convertToInterestDto(UserInterestEntity interestEntity) {
        return UserInterestDto.builder()
                .ingredient(interestEntity.getIngredient())
                .isLiked(interestEntity.getIsLiked())
                .build();
    }
}

