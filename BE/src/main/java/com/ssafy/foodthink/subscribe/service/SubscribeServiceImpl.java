package com.ssafy.foodthink.subscribe.service;

import com.ssafy.foodthink.recipes.dto.RecipeListTop20ResponseDto;
import com.ssafy.foodthink.recipes.entity.RecipeEntity;
import com.ssafy.foodthink.recipes.repository.RecipeRepository;
import com.ssafy.foodthink.subscribe.entity.SubscribeEntity;
import com.ssafy.foodthink.subscribe.repository.SubscribeRepository;
import com.ssafy.foodthink.user.dto.UserInfoDto;
import com.ssafy.foodthink.user.entity.UserEntity;
import com.ssafy.foodthink.user.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class SubscribeServiceImpl implements SubscribeService{
    private final UserRepository userRepository;
    private final SubscribeRepository subscribeRepository;
    private final RecipeRepository recipeRepository;

    public SubscribeServiceImpl(UserRepository userRepository, SubscribeRepository subscribeRepository, RecipeRepository recipeRepository) {
        this.userRepository = userRepository;
        this.subscribeRepository = subscribeRepository;
        this.recipeRepository = recipeRepository;
    }

    @Override
    public void createSubscribe(Long id, String nickname) {
        UserEntity subscriber = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("구독자(현재 로그인한 사용자)를 찾을 수 없습니다."));

        UserEntity subscribedUser = userRepository.findByNickname(nickname)
                .orElseThrow(() -> new RuntimeException("구독 대상 사용자를 찾을 수 없습니다."));

        // 이미 구독 중인지 확인
        Optional<SubscribeEntity> existingSubscription =subscribeRepository
                .findBySubscriberAndSubscribedUser(subscriber, subscribedUser);

        if (existingSubscription.isPresent()) {
            throw new RuntimeException("이미 구독 중입니다.");
        }

        SubscribeEntity subscribeEntity = SubscribeEntity.builder()
                .subscriber(subscriber)
                .subscribedUser(subscribedUser)
                .build();

        subscribeRepository.save(subscribeEntity);
    }

    @Override
    public void deleteSubscribe(Long id, String nickname) {
        UserEntity subscriber = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("구독자(현재 로그인한 사용자)를 찾을 수 없습니다."));

        UserEntity subscribedUser = userRepository.findByNickname(nickname)
                .orElseThrow(() -> new RuntimeException("구독 대상 사용자를 찾을 수 없습니다."));

        // 구독이 존재하는지 확인
        SubscribeEntity subscription = subscribeRepository
                .findBySubscriberAndSubscribedUser(subscriber, subscribedUser)
                .orElseThrow(() -> new RuntimeException("구독이 존재하지 않습니다."));

        subscribeRepository.delete(subscription);  // 이때 구독 삭제 시 cascade로 관련 구독도 삭제됨
    }

    @Override
    public List<UserInfoDto> readSubscribe(Long id) {
        UserEntity userEntity = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("구독자(현재 로그인한 사용자)를 찾을 수 없습니다."));

        List<UserEntity> subscribeEntities = subscribeRepository.findSubscribedUserBySubscriber(userEntity);

        List<UserInfoDto> userInfoDtos = new ArrayList<>();

        for (UserEntity subscribeEntity : subscribeEntities) {
            UserInfoDto userInfoDto = UserInfoDto.builder()
                    .userId(subscribeEntity.getUserId())
                    .email(subscribeEntity.getEmail())
                    .nickname(subscribeEntity.getNickname())
                    .image(subscribeEntity.getImage())
                    .build();

            userInfoDtos.add(userInfoDto);
        }

        return userInfoDtos;
    }

    @Override
    public boolean checkSubscribe(Long id, String nickname) {
        UserEntity subscriber = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("구독자(현재 로그인한 사용자)를 찾을 수 없습니다."));

        UserEntity subscribedUser = userRepository.findByNickname(nickname)
                .orElseThrow(() -> new RuntimeException("구독 대상 사용자를 찾을 수 없습니다."));

        boolean check = subscribeRepository.existsBySubscriberAndSubscribedUser(subscriber, subscribedUser);

        return check;
    }

    @Override
    public int countSubscribedUser(String nickname) {
        UserEntity subscriber = userRepository.findByEmail(nickname)
                .orElseThrow(() -> new RuntimeException("구독자(현재 로그인한 사용자)를 찾을 수 없습니다."));

        return subscribeRepository.countBySubscriber(subscriber);
    }

    @Override
    public List<RecipeListTop20ResponseDto> readRecipesBySubscribe(Long id) {
        UserEntity userEntity = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("로그인한 사용자를 찾을 수 없습니다."));

        //구독한 사용자들
//        List<UserEntity> userEntities = subscribeRepository.findSubscribedUserBySubscriber(userEntity);

        //해당 사용자들 레시피 조회
        List<RecipeEntity> recipeEntities = recipeRepository.findSubscribedRecipes(id);
        return List.of();
    }
}
