package com.ssafy.foodthink.user.service;

import com.ssafy.foodthink.global.S3Service;
import com.ssafy.foodthink.global.exception.AleadyExistsException;
import com.ssafy.foodthink.recipes.entity.RecipeEntity;
import com.ssafy.foodthink.recipes.repository.RecipeRepository;
import com.ssafy.foodthink.user.dto.RecipeViewDto;
import com.ssafy.foodthink.user.dto.UserInfoDto;
import com.ssafy.foodthink.user.dto.UserInterestDto;
import com.ssafy.foodthink.user.entity.RecipeViewHistoryEntity;
import com.ssafy.foodthink.user.entity.UserEntity;
import com.ssafy.foodthink.user.entity.UserInterestEntity;
import com.ssafy.foodthink.user.repository.RecipeViewRepository;
import com.ssafy.foodthink.user.repository.UserInterestRepository;
import com.ssafy.foodthink.user.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserInterestRepository userInterestRepository;
    private final S3Service s3Service;
    private final RecipeViewRepository recipeViewRepository;
    private final RecipeRepository recipeRepository;

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
                .userId(userEntity.getUserId())
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


    // 회원 관심사 수정
    @Transactional
    public List<UserInterestDto> updateUserInterests(Long userId, List<UserInterestDto> interestDtoList){

        UserEntity userEntity = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없어요!!!"));

        // 회원의 기존 관심사 모두 삭제
        userInterestRepository.deleteByUserId(userEntity);

        List<UserInterestEntity> interests = interestDtoList.stream()
                .map(dto -> UserInterestEntity.createInterest(
                        dto.getIngredient(),
                        dto.getIsLiked(),
                        userEntity
                ))
                .collect(Collectors.toList());

        // 회원의 새 관심사 저장
        List<UserInterestEntity> newInterests = userInterestRepository.saveAll(interests);

        return newInterests.stream()
                .map(this::convertToInterestDto)
                .collect(Collectors.toList());
    }

    // 레시피 조회 기록 저장
    @Transactional
    public void createRecipeView(Long userId, Long recipeId) {
        UserEntity userEntity = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없어요!!!"));

        RecipeEntity recipeEntity = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("레시피를 찾을 수 없어요!!!"));

        RecipeViewHistoryEntity history = new RecipeViewHistoryEntity(userEntity, recipeEntity);
        recipeViewRepository.save(history);

        recipeEntity.setHits(recipeEntity.getHits()+1);
        recipeRepository.save(recipeEntity);
    }

    // 사용자의 최근 레시피 기록 조회
    @Transactional
    public List<RecipeViewDto> readRecentRecipeViews(Long userId, int count) {
        UserEntity user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없어요!!!"));

        Pageable pageable = PageRequest.of(0, count, Sort.by(Sort.Direction.DESC, "viewTime"));

        List<RecipeViewHistoryEntity> histories = recipeViewRepository.findByUserEntity(user, pageable);

        return histories.stream()
                .map(this::convertToViewDto)
                .collect(Collectors.toList());
    }



    private RecipeViewDto convertToViewDto(RecipeViewHistoryEntity history) {
        return RecipeViewDto.builder()
                .recipeId(history.getRecipeEntity().getRecipeId())
                .viewTime(history.getViewTime())
                .build();
    }



    private UserInterestDto convertToInterestDto(UserInterestEntity interestEntity) {
        return UserInterestDto.builder()
                .ingredient(interestEntity.getIngredient())
                .isLiked(interestEntity.getIsLiked())
                .build();
    }

    @PostConstruct
    public void initializeUsers() {
        if (userRepository.count() == 0) {
            userRepository.saveAll(List.of(
                    UserEntity.createUser("1", "1", "윈터"),
                    UserEntity.createUser("2", "2", "루피"),
                    UserEntity.createUser("3", "3", "호크스"),
                    UserEntity.createUser("4", "4", "엘사"),
                    UserEntity.createUser("5", "5", "파토스"),
                    UserEntity.createUser("6", "6", "아린"),
                    UserEntity.createUser("7", "7", "루미너스"),
                    UserEntity.createUser("8", "8", "카리나"),
                    UserEntity.createUser("9", "9", "고윤정"),
                    UserEntity.createUser("10", "10", "박보영"),
                    UserEntity.createUser("1", "11", "닝닝"),
                    UserEntity.createUser("12", "12", "미키마우스"),
                    UserEntity.createUser("13", "13", "와조스키"),
                    UserEntity.createUser("14", "14", "영케이"),
                    UserEntity.createUser("15", "15", "주디"),
                    UserEntity.createUser("16", "16", "닉"),
                    UserEntity.createUser("17", "17", "핑핑이"),
                    UserEntity.createUser("18", "18", "스폰지밥"),
                    UserEntity.createUser("19", "19", "뚱이"),
                    UserEntity.createUser("20", "20", "짱구")

            ));
        }
    }
}

