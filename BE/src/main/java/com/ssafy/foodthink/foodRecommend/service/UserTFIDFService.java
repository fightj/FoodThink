package com.ssafy.foodthink.foodRecommend.service;

import com.ssafy.foodthink.feed.entity.FeedEntity;
import com.ssafy.foodthink.feed.entity.FeedLikeEntity;
import com.ssafy.foodthink.feed.repository.FeedLikeRepository;
import com.ssafy.foodthink.foodRecommend.entity.RecipeTfIdfEntity;
import com.ssafy.foodthink.foodRecommend.entity.UserTfIdfEntity;
import com.ssafy.foodthink.foodRecommend.entity.UserTfIdfId;
import com.ssafy.foodthink.foodRecommend.repository.RecipeTfIdfRepository;
import com.ssafy.foodthink.foodRecommend.repository.RecommendInterestRepository;
import com.ssafy.foodthink.foodRecommend.repository.UserTfIdfRepository;
import com.ssafy.foodthink.recipeBookmark.entity.RecipeBookmarkEntity;
import com.ssafy.foodthink.recipeBookmark.repository.RecipeBookmarkRepository;
import com.ssafy.foodthink.recipes.entity.RecipeEntity;
import com.ssafy.foodthink.user.entity.RecipeViewHistoryEntity;
import com.ssafy.foodthink.user.entity.UserEntity;
import com.ssafy.foodthink.user.entity.UserInterestEntity;
import com.ssafy.foodthink.user.repository.RecipeViewRepository;
import com.ssafy.foodthink.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserTFIDFService {

    private final RecipeTfIdfRepository recipeTfIdfRepository;
    private final RecipeBookmarkRepository recipeBookmarkRepository;
    private final RecommendInterestRepository recommendInterestRepository;
    private final UserRepository userRepository;
    private final FeedLikeRepository feedLikeRepository;
    private final RecipeViewRepository recipeViewRepository;
    private final UserTfIdfRepository userTfIdfRepository;

    // 가중치 상수
    private static final double LIKED_WEIGHT = 1.0;
    private static final double DISLIKED_WEIGHT = -1.0;
    private static final double BOOKMARK_WEIGHT = 0.5;
    private static final double LIKED_FEED_WEIGHT = 0.5;
    private static final double VIEWED_RECIPE_WEIGHT = 0.7;

    // 사용자의 모든 feature의 벡터값
//    @Transactional
//    public Map<String, Double> getUserTfIdfProfile(Long userId) {
//        List<UserTfIdfEntity> entities = userTfIdfRepository.findByUserId(userId);
//        return entities.stream()
//                .collect(Collectors.toMap(
//                        UserTfIdfEntity::getFeature,
//                        UserTfIdfEntity::getTfIdfValue
//                ));
//    }



    // 사용자의 벡터값 업데이트(배치 스케줄러로 주기적 업데이트)
//    @Transactional
//    public Map<String, Double> updateUserTfidf(Long userId) {
//
//        userTfIdfRepository.deleteByUserId(userId);
//
//        Map<String, Double> userProfile = new HashMap<>();
//
//        // 선호 재료 TF-IDF 값 추가
//        List<String> likedIngredients = getLikedIngredients(userId);
//        for (String ingredient : likedIngredients) {
//            userProfile.put(ingredient, LIKED_WEIGHT);
//        }
//
//        // 기피 재료 TF-IDF 값 추가
//        List<String> dislikedIngredients = getDislikedIngredients(userId);
//        for (String ingredient : dislikedIngredients) {
//            userProfile.put(ingredient, DISLIKED_WEIGHT);
//        }
//
//        // 북마크한 레시피의 TF-IDF 벡터 평균 계산
//        Map<String, Double> bookmarkProfile = calculateBookmarkProfile(userId);
//
//        // 피드 좋아요한 레시피의 TF-IDF 벡터 평균 계산
//        Map<String, Double> feedLikedProfile = calculateLikedFeedProfile(userId);
//
//        // 조회한 레시피의 TF-IDF 벡터 평균 계산
//        Map<String, Double> recipeViewedProfile = calculateViewedRecipeProfile(userId);
//
//        // TF-IDF 값 통합
//        bookmarkProfile.forEach((feature, value) -> {
//            userProfile.merge(feature, value * BOOKMARK_WEIGHT, Double::sum);
//        });
//        feedLikedProfile.forEach((feature, value) -> {
//            userProfile.merge(feature, value * LIKED_FEED_WEIGHT, Double::sum);
//        });
//        recipeViewedProfile.forEach((feature, value) -> {
//            userProfile.merge(feature, value * VIEWED_RECIPE_WEIGHT, Double::sum);
//        });
//
//        Map<String, Double> normalizedProfile = normalizeProfile(userProfile);
//
//        log.debug("사용자의 모든 특성의 TF-IDF 값이 업데이트 되었어요.");
//
//        //return normalizeProfile(userProfile); // 정규화 후 반환
//
//        List<UserTfIdfEntity> entities = normalizedProfile.entrySet().stream()
//                .map(entry -> new UserTfIdfEntity(
//                        userId,
//                        entry.getKey(),
//                        entry.getValue()
//                ))
//                .collect(Collectors.toList());
//
//        userTfIdfRepository.saveAll(entities);
//
//        return normalizedProfile;
//    }

    // 사용자 선호 재료 조회
    public List<String> getLikedIngredients(Long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없어요"));
        return recommendInterestRepository.findByUserIdAndIsLiked(user, true)
                .stream()
                .map(UserInterestEntity::getIngredient)
                .collect(Collectors.toList());
    }

    // 사용자 기피 재료 조회
    public List<String> getDislikedIngredients(Long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없어요"));
        return recommendInterestRepository.findByUserIdAndIsLiked(user, false)
                .stream()
                .map(UserInterestEntity::getIngredient)
                .collect(Collectors.toList());
    }

    // 북마크한 레시피의 TF-IDF 벡터 평균 계산
    private Map<String, Double> calculateBookmarkProfile(Long userId) {
        // 사용자의 북마크한 레시피 목록 조회
        List<RecipeBookmarkEntity> bookmarkedRecipes = recipeBookmarkRepository.findByUserEntity_UserId(userId);

        // 각 특성(feature)별 TF-IDF 값의 합과 개수를 저장할 맵
        Map<String, Double> aggregatedValues = new HashMap<>();
        Map<String, Integer> featureCounts = new HashMap<>();

        // 북마크한 모든 레시피의 재료 TF-IDF 값 합산
        for (RecipeBookmarkEntity bookmark : bookmarkedRecipes) {
            RecipeEntity recipe = bookmark.getRecipeEntity();
            List<RecipeTfIdfEntity> tfIdfValues = recipeTfIdfRepository.findByRecipe(recipe);

            for (RecipeTfIdfEntity tfIdf : tfIdfValues) {
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

    // 피드 좋아요한 레시피의 TF-IDF 벡터 평균 계산
    private Map<String, Double> calculateLikedFeedProfile(Long userId) {
        // 사용자가 좋아요한 피드 목록 조회
        List<FeedLikeEntity> likedFeeds = feedLikeRepository.findByUserEntity_userId(userId);

        // 각 특성별 TF-IDF 값의 합과 개수
        Map<String, Double> aggregatedValues = new HashMap<>();
        Map<String, Integer> featureCounts = new HashMap<>();

        // 좋아요한 모든 피드의 레시피 재료 TF-IDF 값 합산
        for (FeedLikeEntity like : likedFeeds) {
            FeedEntity feed = like.getFeedEntity();
            RecipeEntity recipe = feed.getRecipeEntity();

            // 사용자가 좋아요한 피드에 레시피 정보가 있는 경우만
            if (recipe != null) {
                List<RecipeTfIdfEntity> tfIdfValues = recipeTfIdfRepository.findByRecipe(recipe);

                for (RecipeTfIdfEntity tfIdf : tfIdfValues) {
                    String feature = tfIdf.getFeature();
                    double value = tfIdf.getTfIdfValue();

                    aggregatedValues.merge(feature, value, Double::sum);
                    featureCounts.merge(feature, 1, Integer::sum);
                }
            }
        }

        // 평균 계산
        return aggregatedValues.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        e -> e.getValue() / featureCounts.get(e.getKey())
                ));
    }

    // 사용자가 조회한 레시피의 TF-IDF 벡터 평균 계산
    private Map<String, Double> calculateViewedRecipeProfile(Long userId) {

        // 사용자가 조회한 모든 레시피 조회
        List<RecipeViewHistoryEntity> viewedRecipes = recipeViewRepository.findByUserEntity_userId(userId);

        // 각 특성(feature)별 TF-IDF 값의 합과 개수를 저장할 맵
        Map<String, Double> aggregatedValues = new HashMap<>();
        Map<String, Integer> featureCounts = new HashMap<>();

        // TF-IDF 계산
        for(RecipeViewHistoryEntity views : viewedRecipes){
            RecipeEntity recipe = views.getRecipeEntity();
            List<RecipeTfIdfEntity> tfIdfValues = recipeTfIdfRepository.findByRecipe(recipe);

            for(RecipeTfIdfEntity tfIdf: tfIdfValues){
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

    // L2 정규화
    private Map<String, Double> normalizeProfile(Map<String, Double> profile) {

        double norm = Math.sqrt(profile.values().stream().mapToDouble(v -> v * v).sum());

        if (norm == 0) return profile;

        return profile.entrySet().stream()
                .collect(Collectors.toMap(Map.Entry::getKey,e -> e.getValue() / norm));
    }

    // upsert 사용 시 아래 코드

//    @Transactional
//    public Map<String, Double> updateUserTfidf(Long userId) {
//        Map<String, Double> currentProfile = getUserTfIdfProfile(userId);
//        Map<String, Double> newProfile = new HashMap<>();
//
//        // 선호 재료 업데이트
//        updateFeatures(newProfile, getLikedIngredients(userId), LIKED_WEIGHT);
//
//        // 기피 재료 업데이트
//        updateFeatures(newProfile, getDislikedIngredients(userId), DISLIKED_WEIGHT);
//
//        // 북마크, 좋아요한 피드, 조회한 레시피 프로필 업데이트
//        updateProfileWithWeightedFeatures(newProfile, calculateBookmarkProfile(userId), BOOKMARK_WEIGHT);
//        updateProfileWithWeightedFeatures(newProfile, calculateLikedFeedProfile(userId), LIKED_FEED_WEIGHT);
//        updateProfileWithWeightedFeatures(newProfile, calculateViewedRecipeProfile(userId), VIEWED_RECIPE_WEIGHT);
//
//        Map<String, Double> normalizedProfile = normalizeProfile(newProfile);
//
//        // 증분 업데이트 수행
//        updateUserTfIdfEntities(userId, currentProfile, normalizedProfile);
//
//        return normalizedProfile;
//    }
//
//    private void updateFeatures(Map<String, Double> profile, List<String> features, double weight) {
//        features.forEach(feature -> profile.put(feature, weight));
//    }
//
//    private void updateProfileWithWeightedFeatures(Map<String, Double> profile, Map<String, Double> features, double weight) {
//        features.forEach((feature, value) ->
//                profile.merge(feature, value * weight, Double::sum)
//        );
//    }
//
//    @Transactional
//    protected void updateUserTfIdfEntities(Long userId, Map<String, Double> currentProfile, Map<String, Double> newProfile) {
//        Set<String> allFeatures = new HashSet<>(currentProfile.keySet());
//        allFeatures.addAll(newProfile.keySet());
//
//        for (String feature : allFeatures) {
//            Double newValue = newProfile.get(feature);
//            if (newValue == null) {
//                // 특성이 새 프로필에 없으면 삭제
//                userTfIdfRepository.deleteByUserIdAndFeature(userId, feature);
//            } else {
//                Double currentValue = currentProfile.get(feature);
//                if (currentValue == null || !currentValue.equals(newValue)) {
//                    // 새로운 특성이거나 값이 변경된 경우 업데이트
//                    userTfIdfRepository.upsert(userId, feature, newValue);
//                }
//            }
//        }
//    }

    // upsert + 복합키 사용시 아래 코드

    // 사용자의 모든 feature의 벡터값
    public Map<String, Double> getUserTfIdfProfile(Long userId) {
        return userTfIdfRepository.findByIdUserId(userId).stream()
                .collect(Collectors.toMap(
                        UserTfIdfEntity::getFeature,
                        UserTfIdfEntity::getTfIdfValue
                ));
    }

    // 사용자의 벡터값 업데이트(배치 스케줄러로 주기적 업데이트)
    @Transactional
    public Map<String, Double> updateUserTfidf(Long userId) {
        Map<String, Double> currentProfile = getUserTfIdfProfile(userId);
        Map<String, Double> newProfile = new HashMap<>();

        updateFeatures(newProfile, getLikedIngredients(userId), LIKED_WEIGHT);
        updateFeatures(newProfile, getDislikedIngredients(userId), DISLIKED_WEIGHT);

        updateProfileWithWeightedFeatures(newProfile, calculateBookmarkProfile(userId), BOOKMARK_WEIGHT);
        updateProfileWithWeightedFeatures(newProfile, calculateLikedFeedProfile(userId), LIKED_FEED_WEIGHT);
        updateProfileWithWeightedFeatures(newProfile, calculateViewedRecipeProfile(userId), VIEWED_RECIPE_WEIGHT);

        Map<String, Double> normalizedProfile = normalizeProfile(newProfile);

        updateUserTfIdfEntities(userId, currentProfile, normalizedProfile);

        return normalizedProfile;
    }

    private void updateFeatures(Map<String, Double> profile, List<String> features, double weight) {
        features.forEach(feature -> profile.put(feature, weight));
    }

    private void updateProfileWithWeightedFeatures(Map<String, Double> profile, Map<String, Double> features, double weight) {
        features.forEach((feature, value) ->
                profile.merge(feature, value * weight, Double::sum)
        );
    }

    @Transactional
    protected void updateUserTfIdfEntities(Long userId, Map<String, Double> currentProfile, Map<String, Double> newProfile) {
        Set<String> allFeatures = new HashSet<>(currentProfile.keySet());
        allFeatures.addAll(newProfile.keySet());

        for (String feature : allFeatures) {
            Double newValue = newProfile.get(feature);
            if (newValue == null) {
                userTfIdfRepository.deleteById(new UserTfIdfId(userId, feature));
            } else {
                Double currentValue = currentProfile.get(feature);
                if (currentValue == null || !currentValue.equals(newValue)) {
                    userTfIdfRepository.save(new UserTfIdfEntity(userId, feature, newValue));
                }
            }
        }
    }




}
