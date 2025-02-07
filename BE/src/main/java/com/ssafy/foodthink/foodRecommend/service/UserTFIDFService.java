package com.ssafy.foodthink.foodRecommend.service;

import com.ssafy.foodthink.feed.entity.FeedEntity;
import com.ssafy.foodthink.feed.entity.FeedLikeEntity;
import com.ssafy.foodthink.feed.repository.FeedLikeRepository;
import com.ssafy.foodthink.foodRecommend.entity.RecipeTfIdfEntity;
import com.ssafy.foodthink.foodRecommend.entity.UserTfIdfEntity;
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
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

//@Service
//@RequiredArgsConstructor
//public class UserTFIDFService {
//
//    private final RecipeTfIdfRepository recipeTfIdfRepository;
//    private final RecipeBookmarkRepository recipeBookmarkRepository;
//    private final RecommendInterestRepository recommendInterestRepository;
//    private final UserRepository userRepository;
//    private final FeedLikeRepository feedLikeRepository;
//    private final RecipeViewRepository recipeViewRepository;
//    private final UserTfIdfRepository userTfIdfRepository;
//
//    // 가중치 상수
//    private static final double LIKED_WEIGHT = 1.0;
//    private static final double DISLIKED_WEIGHT = -1.0;
//    private static final double BOOKMARK_WEIGHT = 0.5;
//    private static final double LIKED_FEED_WEIGHT = 0.5;
//    private static final double VIEWED_RECIPE_WEIGHT = 0.7;
//
//    public Map<String,Double> generateUserProfile(Long userId) {
//
//        Map<String, Double> userProfile = new HashMap<>();
//
//        // 선호 재료
//        List<String> likedIngredients = getLikedIngredients(userId);
//        for (String ingredient : likedIngredients) {
//            userProfile.put(ingredient, LIKED_WEIGHT);
//        }
//
//        // 기피 재료
//        List<String> dislikedIngredients = getDislikedIngredients(userId);
//        for (String ingredient : dislikedIngredients) {
//            userProfile.put(ingredient, DISLIKED_WEIGHT);
//        }
//
//        // 북마크한 레시피의 IF-IDF 벡터 평균 계산
//        Map<String, Double> bookmarkProfile = calculateBookmarkProfile(userId);
//        // 피드 좋아요한 레시피의 IF-IDF 벡터 평균 계산
//        Map<String, Double> feedLikedProfile = calculateLikedFeedProfile(userId);
//        // 조회한 레시피의 IF-IDF 벡터 평균 계산
//        Map<String, Double> recipeViewedProfile = calculateViewedRecipeProfile(userId);
//
//        //  프로필 정보 통합
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
//        // 프로필 벡터 정규화
//        return normalizeProfile(userProfile);
//    }
//
//    // 사용자 선호 재료
//    public List<String> getLikedIngredients(Long userId) {
//        UserEntity user = userRepository.findById(userId)
//                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없어요"));
//        return recommendInterestRepository.findByUserIdAndIsLiked(user, true)
//                .stream()
//                .map(UserInterestEntity::getIngredient)
//                .collect(Collectors.toList());
//    }
//
//    // 사용자 기피 재료
//    public List<String> getDislikedIngredients(Long userId) {
//        UserEntity user = userRepository.findById(userId)
//                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없어요"));
//        return recommendInterestRepository.findByUserIdAndIsLiked(user, false)
//                .stream()
//                .map(UserInterestEntity::getIngredient)
//                .collect(Collectors.toList());
//    }
//
//
//    // 북마크한 레시피
//    private Map<String, Double> calculateBookmarkProfile(Long userId) {
//        // 사용자의 북마크한 레시피 목록 조회
//        List<RecipeBookmarkEntity> bookmarkedRecipes = recipeBookmarkRepository.findByUserEntity_UserId(userId);
//
//        // 각 특성(feature)별 TF-IDF 값의 합과 개수를 저장할 맵
//        Map<String, Double> aggregatedValues = new HashMap<>();
//        Map<String, Integer> featureCounts = new HashMap<>();
//
//        // 북마크한 모든 레시피의 재료 TF-IDF 값 합산
//        for (RecipeBookmarkEntity bookmark : bookmarkedRecipes) {
//            RecipeEntity recipe = bookmark.getRecipeEntity();
//            List<RecipeTfIdfEntity> tfIdfValues = recipeTfIdfRepository.findByRecipe(recipe);
//
//            for (RecipeTfIdfEntity tfIdf : tfIdfValues) {
//                String feature = tfIdf.getFeature();
//                double value = tfIdf.getTfIdfValue();
//
//                aggregatedValues.merge(feature, value, Double::sum);
//                featureCounts.merge(feature, 1, Integer::sum);
//            }
//        }
//
//        // 평균 계산
//        return aggregatedValues.entrySet().stream()
//                .collect(Collectors.toMap(
//                        Map.Entry::getKey,
//                        e -> e.getValue() / featureCounts.get(e.getKey())
//                ));
//    }
//
//    // 피드 좋아요한 레시피
//    private Map<String, Double> calculateLikedFeedProfile(Long userId) {
//        // 사용자가 좋아요한 피드 목록 조회
//        List<FeedLikeEntity> likedFeeds = feedLikeRepository.findByUserEntity_userId(userId);
//
//        // 각 특성별 TF-IDF 값의 합과 개수
//        Map<String, Double> aggregatedValues = new HashMap<>();
//        Map<String, Integer> featureCounts = new HashMap<>();
//
//        // 좋아요한 모든 피드의 레시피 재료 TF-IDF 값 합산
//        for (FeedLikeEntity like : likedFeeds) {
//            FeedEntity feed = like.getFeedEntity();
//            RecipeEntity recipe = feed.getRecipeEntity();
//
//            // 사용자가 좋아요한 피드에 레시피 정보가 있는 경우만
//            if (recipe != null) {
//                List<RecipeTfIdfEntity> tfIdfValues = recipeTfIdfRepository.findByRecipe(recipe);
//
//                for (RecipeTfIdfEntity tfIdf : tfIdfValues) {
//                    String feature = tfIdf.getFeature();
//                    double value = tfIdf.getTfIdfValue();
//
//                    aggregatedValues.merge(feature, value, Double::sum);
//                    featureCounts.merge(feature, 1, Integer::sum);
//                }
//            }
//        }
//
//        // 평균 계산
//        return aggregatedValues.entrySet().stream()
//                .collect(Collectors.toMap(
//                        Map.Entry::getKey,
//                        e -> e.getValue() / featureCounts.get(e.getKey())
//                ));
//    }
//
//    // 사용자가 조회한 레시피 벡터 계산
//    private Map<String, Double> calculateViewedRecipeProfile(Long userId) {
//
//        // 사용자가 조회한 모든 레시피 조회
//        List<RecipeViewHistoryEntity> viewedRecipes = recipeViewRepository.findByUserEntity_userId(userId);
//
//        // 각 특성(feature)별 TF-IDF 값의 합과 개수를 저장할 맵
//        Map<String, Double> aggregatedValues = new HashMap<>();
//        Map<String, Integer> featureCounts = new HashMap<>();
//
//        // TF-IDF 계산
//        for(RecipeViewHistoryEntity views : viewedRecipes){
//            RecipeEntity recipe = views.getRecipeEntity();
//            List<RecipeTfIdfEntity> tfIdfValues = recipeTfIdfRepository.findByRecipe(recipe);
//
//            for(RecipeTfIdfEntity tfIdf: tfIdfValues){
//                String feature = tfIdf.getFeature();
//                double value = tfIdf.getTfIdfValue();
//
//                aggregatedValues.merge(feature, value, Double::sum);
//                featureCounts.merge(feature, 1, Integer::sum);
//
//            }
//
//        }
//        // 평균 계산
//        return aggregatedValues.entrySet().stream()
//                .collect(Collectors.toMap(
//                        Map.Entry::getKey,
//                        e -> e.getValue() / featureCounts.get(e.getKey())
//                ));
//    }
//
//
//    // L2 정규화
//    private Map<String, Double> normalizeProfile(Map<String, Double> profile) {
//
//        double norm = Math.sqrt(profile.values().stream().mapToDouble(v -> v * v).sum());
//
//        if (norm == 0) return profile;
//
//        return profile.entrySet().stream()
//                .collect(Collectors.toMap(Map.Entry::getKey,e -> e.getValue() / norm));
//    }
//
//    // 사용자 TF-IDF 업데이트
//    // 선호/기피 재료는 삭제 후 새로 삽입
//    // 나머지 재료는 병합
//    @Transactional
//    public void updateUserTfidf(Long userId, Map<String, Double> likedIngredients, Map<String, Double> dislikedIngredients, Map<String, Double> otherFeatures){
//
//        //  선호/기피 재료 삭제
//        userTfIdfRepository.deleteFeaturesByPrefix(userId,"liked_");
//        userTfIdfRepository.deleteFeaturesByPrefix(userId, "disliked_");
//
//        // flush 호출로 삭제 작업 즉시 반영
//        userTfIdfRepository.flush();
//
//        // 선호 재료 삽입
//        likedIngredients.forEach((ingredient, tfidfValue) -> {
//            UserTfIdfEntity entity = new UserTfIdfEntity();
//            entity.setUserId(userId);
//            entity.setFeature("liked_" + ingredient); // prefix 추가
//            entity.setTfIdfValue(tfidfValue);
//            userTfIdfRepository.save(entity);
//        });
//
//        // 기피 재료 삽입
//        dislikedIngredients.forEach((ingredient, tfidfValue) -> {
//            UserTfIdfEntity entity = new UserTfIdfEntity();
//            entity.setUserId(userId);
//            entity.setFeature("disliked_" + ingredient); // prefix 추가
//            entity.setTfIdfValue(tfidfValue);
//            userTfIdfRepository.save(entity);
//        });
//
//        // 나머지 feature 업데이트 (병합 처리)
//        otherFeatures.forEach((feature, tfidfValue) ->{
//            Optional<UserTfIdfEntity> existingRecord = userTfIdfRepository.findByUserIdAndFeature(userId, feature);
//
//            if(existingRecord.isPresent()){
//                UserTfIdfEntity entity = existingRecord.get();
//                entity.setTfIdfValue(tfidfValue);
//                userTfIdfRepository.save(entity);
//            }else{
//                UserTfIdfEntity newEntity = new UserTfIdfEntity();
//                newEntity.setUserId(userId);
//                newEntity.setFeature(feature);
//                newEntity.setTfIdfValue(tfidfValue);
//                userTfIdfRepository.save(newEntity);
//            }
//        });
//
//    }
//
//}
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


    // 사용자 TF-IDF 업데이트:
    // 1. 선호/기피 재료는 삭제 후 새로 삽입.
    // 2. 북마크한 레시피 등 나머지 재료는 병합.
    @Transactional
    public void updateUserTfidf(Long userId) {
        // 사용자 프로필 생성
        Map<String, Double> userProfile = generateUserProfile(userId);

        // 선호/기피 재료 분리
        Map<String, Double> likedIngredients = extractFeaturesWithPrefix(userProfile, "liked_");
        Map<String, Double> dislikedIngredients = extractFeaturesWithPrefix(userProfile, "disliked_");

        // 나머지 재료 (prefix 없는 일반 feature)
        Map<String, Double> otherFeatures = userProfile.entrySet().stream()
                .filter(entry -> !entry.getKey().startsWith("liked_") && !entry.getKey().startsWith("disliked_"))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

        // 1. 선호/기피 재료 삭제
        userTfIdfRepository.deleteFeaturesByPrefix(userId, "liked_");
        userTfIdfRepository.deleteFeaturesByPrefix(userId, "disliked_");

        // Hibernate flush() 호출 (삭제 작업 즉시 반영)
        userTfIdfRepository.flush();

        // 2. 선호 재료 삽입
        likedIngredients.forEach((ingredient, tfidfValue) -> {
            UserTfIdfEntity entity = new UserTfIdfEntity();
            entity.setUserId(userId);
            entity.setFeature(removePrefix(ingredient));
            entity.setTfIdfValue(tfidfValue);
            userTfIdfRepository.save(entity);
        });

        // 3. 기피 재료 삽입
        dislikedIngredients.forEach((ingredient, tfidfValue) -> {
            UserTfIdfEntity entity = new UserTfIdfEntity();
            entity.setUserId(userId);
            entity.setFeature(removePrefix(ingredient));
            entity.setTfIdfValue(tfidfValue);
            userTfIdfRepository.save(entity);
        });

        // 4. 나머지 feature 업데이트 (병합 처리)
        otherFeatures.forEach((feature, tfidfValue) -> {
            Optional<UserTfIdfEntity> existingRecord = userTfIdfRepository.findByUserIdAndFeature(userId, feature);

            if (existingRecord.isPresent()) {
                UserTfIdfEntity entity = existingRecord.get();
                entity.setTfIdfValue(tfidfValue);
                userTfIdfRepository.save(entity);
            } else {
                UserTfIdfEntity newEntity = new UserTfIdfEntity();
                newEntity.setUserId(userId);
                newEntity.setFeature(feature);
                newEntity.setTfIdfValue(tfidfValue);
                userTfIdfRepository.save(newEntity);
            }
        });
    }

     // 사용자 프로필 생성:
     // 모든 feature를 조회하고 prefix를 제거한 뒤 병합.
    public Map<String, Double> generateUserProfile(Long userId) {

        Map<String, Double> userProfile = new HashMap<>();

        // 선호 재료
        List<String> likedIngredients = getLikedIngredients(userId);
        for (String ingredient : likedIngredients) {
            userProfile.put(ingredient, LIKED_WEIGHT); // Prefix 추가
        }

        // 기피 재료
        List<String> dislikedIngredients = getDislikedIngredients(userId);
        for (String ingredient : dislikedIngredients) {
            userProfile.put(ingredient, DISLIKED_WEIGHT); // Prefix 추가
        }

        // 북마크한 레시피의 TF-IDF 벡터 평균 계산
        Map<String, Double> bookmarkProfile = calculateBookmarkProfile(userId);

        // 피드 좋아요한 레시피의 TF-IDF 벡터 평균 계산
        Map<String, Double> feedLikedProfile = calculateLikedFeedProfile(userId);

        // 조회한 레시피의 TF-IDF 벡터 평균 계산
        Map<String, Double> recipeViewedProfile = calculateViewedRecipeProfile(userId);

        // 프로필 정보 통합 (가중치 적용)
        bookmarkProfile.forEach((feature, value) -> {
            userProfile.merge(feature, value * BOOKMARK_WEIGHT, Double::sum);
        });
        feedLikedProfile.forEach((feature, value) -> {
            userProfile.merge(feature, value * LIKED_FEED_WEIGHT, Double::sum);
        });
        recipeViewedProfile.forEach((feature, value) -> {
            userProfile.merge(feature, value * VIEWED_RECIPE_WEIGHT, Double::sum);
        });

        return normalizeProfile(userProfile); // 정규화 후 반환
    }

    // Prefix 제거(liked_ 또는 disliked_)
    private String removePrefix(String feature) {
        if (feature.startsWith("liked_")) {
            return feature.replace("liked_", "");
        } else if (feature.startsWith("disliked_")) {
            return feature.replace("disliked_", "");
        }
        return feature;
    }

    // 특정 prefix를 가진 feature 추출.
    private Map<String, Double> extractFeaturesWithPrefix(Map<String, Double> profile, String prefix) {
        return profile.entrySet().stream()
                .filter(entry -> entry.getKey().startsWith(prefix))
                .collect(Collectors.toMap(
                        entry -> entry.getKey().replace(prefix, ""), // Prefix 제거
                        Map.Entry::getValue
                ));
    }

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


}
