package com.ssafy.foodthink.foodRecommend.service;

import com.ssafy.foodthink.foodRecommend.entity.RecipeTfIdf;
import com.ssafy.foodthink.foodRecommend.repository.RecipeTfIdfRepository;
import com.ssafy.foodthink.foodRecommend.repository.RecommendInterestRepository;
import com.ssafy.foodthink.recipeBookmark.entity.RecipeBookmarkEntity;
import com.ssafy.foodthink.recipeBookmark.repository.RecipeBookmarkRepository;
import com.ssafy.foodthink.recipes.entity.RecipeEntity;
import com.ssafy.foodthink.user.entity.UserEntity;
import com.ssafy.foodthink.user.entity.UserInterestEntity;
import com.ssafy.foodthink.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserTFIDFService {

    private final RecipeTfIdfRepository recipeTfIdfRepository;
    private final RecipeBookmarkRepository recipeBookmarkRepository;
    private final RecommendInterestRepository recommendInterestRepository;
    private final UserRepository userRepository;

    // 가중치 상수
    private static final double LIKED_WEIGHT = 1.0;
    private static final double DISLIKED_WEIGHT = -1.0;
    private static final double BOOKMARK_WEIGHT = 0.5;

    public Map<String,Double> generateUserProfile(Long userId) {

        Map<String, Double> userProfile = new HashMap<>();

        // 선호 재료
        List<String> likedIngredients = getLikedIngredients(userId);
        for (String ingredient : likedIngredients) {
            userProfile.put(ingredient, LIKED_WEIGHT);
        }

        // 기피 재료
        List<String> dislikedIngredients = getDislikedIngredients(userId);
        for (String ingredient : dislikedIngredients) {
            userProfile.put(ingredient, DISLIKED_WEIGHT);
        }

        // 북마크한 레시피의 IF-IDF 벡터 평균 계산
        Map<String, Double> bookmarkProfile = calculateBookmarkProfile(userId);


        return null;
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

    private Map<String, Double> calculateBookmarkProfile(Long userId) {

        List<RecipeBookmarkEntity> bookmarkedRecipes = recipeBookmarkRepository.findByUserEntity_UserId(userId);

        Map<String, Double> aggregations = new HashMap<>(); // 각 특성 별 TF-IDF 합
        Map<String, Integer> counts = new HashMap<>(); // 각 특성 별 TF-IDF 개수

        for(RecipeBookmarkEntity recipe: bookmarkedRecipes){
//            List<RecipeTfIdf> tfIdfValues = recipeTfIdfRepository.findByRecipe(recipe);
//
//            for
        }




        return null;
    }

}
