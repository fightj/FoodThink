package com.ssafy.foodthink.foodRecommend.service;

import com.ssafy.foodthink.foodRecommend.repository.RecommendInterestRepository;
import com.ssafy.foodthink.foodRecommend.repository.UserRecipeTitleRepository;
import com.ssafy.foodthink.recipes.entity.UserRecipeEntity;
import com.ssafy.foodthink.user.entity.UserEntity;
import com.ssafy.foodthink.user.entity.UserInterestEntity;
import com.ssafy.foodthink.user.repository.UserRepository;
import org.apache.commons.text.similarity.CosineSimilarity;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RecommendInterestService {

    private final RecommendInterestRepository recommendInterestRepository;
    private final UserRepository userRepository;
    private final GptService gptService;
    private final UserRecipeTitleRepository userRecipeTitleRepository;

    public RecommendInterestService(RecommendInterestRepository recommendInterestRepository,
                                    UserRepository userRepository,
                                    GptService gptService,
                                    UserRecipeTitleRepository userRecipeTitleRepository) {
        this.recommendInterestRepository = recommendInterestRepository;
        this.userRepository = userRepository;
        this.gptService = gptService;
        this.userRecipeTitleRepository = userRecipeTitleRepository;
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
//    public List<UserRecipeEntity> getRecipeRecommendation(Long userId) {
//        List<String> likedIngredients = getLikedIngredients(userId);
//        List<String> dislikedIngredients = getDislikedIngredients(userId);
//
//        String likedIngredientsString = String.join(", ", likedIngredients);
//        String dislikedIngredientsString = String.join(", ", dislikedIngredients);
//
//        String gptRecommendations = gptService.getRecipeRecommendation(likedIngredientsString, dislikedIngredientsString);
//        List<String> recommendedRecipes = Arrays.asList(gptRecommendations.split("\n"));
//
//        List<UserRecipeEntity> publicRecipes = userRecipeTitleRepository.findByIsPublicTrue();
//
//        return findSimilarRecipes(recommendedRecipes, publicRecipes);
//    }
//    private List<UserRecipeEntity> findSimilarRecipes(List<String> recommendedRecipes, List<UserRecipeEntity> publicRecipes) {
//        CosineSimilarity cosineSimilarity = new CosineSimilarity();
//        Map<UserRecipeEntity, Double> similarityScores = new HashMap<>();
//
//        for (UserRecipeEntity recipe : publicRecipes) {
//            double maxSimilarity = 0.0;
//            for (String recommendedRecipe : recommendedRecipes) {
//                Map<CharSequence, Integer> vector1 = getWordFrequency(recipe.getRecipeTitle());
//                Map<CharSequence, Integer> vector2 = getWordFrequency(recommendedRecipe);
//                double similarity = cosineSimilarity.cosineSimilarity(vector1, vector2);
//                maxSimilarity = Math.max(maxSimilarity, similarity);
//            }
//            similarityScores.put(recipe, maxSimilarity);
//        }
//
//        return similarityScores.entrySet().stream()
//                .sorted(Map.Entry.<UserRecipeEntity, Double>comparingByValue().reversed())
//                .limit(5)  // 상위 5개의 유사한 레시피 반환
//                .map(Map.Entry::getKey)
//                .collect(Collectors.toList());
//    }
//
//    private Map<CharSequence, Integer> getWordFrequency(String text) {
//        return Arrays.stream(text.toLowerCase().split("\\W+"))
//                .collect(Collectors.toMap(
//                        word -> word,
//                        word -> 1,
//                        Integer::sum
//                ));
//    }
}
