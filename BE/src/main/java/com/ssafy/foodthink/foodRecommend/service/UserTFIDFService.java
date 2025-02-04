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

        //  프로필 정보 통합
        bookmarkProfile.forEach((feature, value) -> {
            userProfile.merge(feature, value * BOOKMARK_WEIGHT, Double::sum);
        });

        // 프로필 벡터 정규화
        return normalizeProfile(userProfile);
    }

    // 사용자 선호 재료
    public List<String> getLikedIngredients(Long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없어요"));
        return recommendInterestRepository.findByUserIdAndIsLiked(user, true)
                .stream()
                .map(UserInterestEntity::getIngredient)
                .collect(Collectors.toList());
    }

    // 사용자 기피 재료
    public List<String> getDislikedIngredients(Long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없어요"));
        return recommendInterestRepository.findByUserIdAndIsLiked(user, false)
                .stream()
                .map(UserInterestEntity::getIngredient)
                .collect(Collectors.toList());
    }

    // 북마크한 레시피
    private Map<String, Double> calculateBookmarkProfile(Long userId) {
        // 사용자의 북마크한 레시피 목록 조회
        List<RecipeBookmarkEntity> bookmarkedRecipes = recipeBookmarkRepository.findByUserEntity_UserId(userId);

        // 각 특성(feature)별 TF-IDF 값의 합과 개수를 저장할 맵
        Map<String, Double> aggregatedValues = new HashMap<>();
        Map<String, Integer> featureCounts = new HashMap<>();

        // 북마크한 모든 레시피의 재료 TF-IDF 값 합산
        for (RecipeBookmarkEntity bookmark : bookmarkedRecipes) {
            RecipeEntity recipe = bookmark.getRecipeEntity();
            List<RecipeTfIdf> tfIdfValues = recipeTfIdfRepository.findByRecipe(recipe);

            for (RecipeTfIdf tfIdf : tfIdfValues) {
                String feature = tfIdf.getFeature();
                double value = tfIdf.getTfIdfValue();

                aggregatedValues.merge(feature, value, Double::sum);
                featureCounts.merge(feature, 1, Integer::sum);
            }
        }

        // 평균 계산
        return aggregatedValues.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        e -> e.getValue() / featureCounts.get(e.getKey())
                ));
    }

    // 정규화
    private Map<String, Double> normalizeProfile(Map<String, Double> profile) {
        // L2 정규화 수행
        double norm = Math.sqrt(
                profile.values().stream()
                        .mapToDouble(v -> v * v)
                        .sum()
        );

        if (norm == 0) return profile;

        return profile.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        e -> e.getValue() / norm
                ));
    }

}
