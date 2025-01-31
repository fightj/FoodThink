package com.ssafy.foodthink.foodRecommend.service;

import com.ssafy.foodthink.foodRecommend.repository.RecommendInterestRepository;
import com.ssafy.foodthink.user.entity.UserEntity;
import com.ssafy.foodthink.user.entity.UserInterestEntity;
import com.ssafy.foodthink.user.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecommendInterestService {

    private final RecommendInterestRepository recommendInterestRepository;
    private final UserRepository userRepository;
    private final GptService gptService;

    public RecommendInterestService(RecommendInterestRepository recommendInterestRepository,
                                    UserRepository userRepository,
                                    GptService gptService) {
        this.recommendInterestRepository = recommendInterestRepository;
        this.userRepository = userRepository;
        this.gptService = gptService;
    }

    public List<String> getLikedIngredients(Long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없어요"));
        return recommendInterestRepository.findByUserIdAndIsLiked(user, true)
                .stream()
                .map(UserInterestEntity::getIngredient)
                .collect(Collectors.toList());
    }

    public List<String> getDislikedIngredients(Long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없어요"));
        return recommendInterestRepository.findByUserIdAndIsLiked(user, false)
                .stream()
                .map(UserInterestEntity::getIngredient)
                .collect(Collectors.toList());
    }
    public String getRecipeRecommendation(Long userId) {
        List<String> likedIngredients = getLikedIngredients(userId);
        List<String> dislikedIngredients = getDislikedIngredients(userId);

        String likedIngredientsString = String.join(", ", likedIngredients);
        String dislikedIngredientsString = String.join(", ", dislikedIngredients);

        return gptService.getRecipeRecommendation(likedIngredientsString, dislikedIngredientsString);
    }
}
