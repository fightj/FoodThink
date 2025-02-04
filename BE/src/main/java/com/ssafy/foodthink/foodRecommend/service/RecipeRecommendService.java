package com.ssafy.foodthink.foodRecommend.service;

import com.ssafy.foodthink.foodRecommend.dto.RecipeRecommendationDto;
import com.ssafy.foodthink.foodRecommend.entity.RecipeTfIdfEntity;
import com.ssafy.foodthink.foodRecommend.repository.RecipeTfIdfRepository;
import com.ssafy.foodthink.recipes.entity.RecipeEntity;
import com.ssafy.foodthink.recipes.repository.RecipeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecipeRecommendService {
    private final RecipeTfIdfRepository recipeTfIdfRepository;
    private final RecipeRepository recipeRepository;
    private final UserTFIDFService userTFIDFService;

    public List<RecipeRecommendationDto> getRecommendedRecipes(Long userId, int limit) {
        // 사용자 프로필 벡터
        Map<String, Double> userProfile = userTFIDFService.generateUserProfile(userId);

        // 모든 레시피의 TF-IDF 벡터
        List<RecipeEntity> allRecipes = recipeRepository.findAll();

        List<RecipeRecommendationDto> recommendations = allRecipes.stream()
                .map(recipe -> {
                    List<RecipeTfIdfEntity> recipeTfIdfs = recipeTfIdfRepository.findByRecipe(recipe);
                    Map<String, Double> recipeVector = recipeTfIdfs.stream()
                            .collect(Collectors.toMap(
                                    RecipeTfIdfEntity::getFeature,
                                    RecipeTfIdfEntity::getTfIdfValue
                            ));

                    // 레시피의 재료, 수량
                    List<String> ingredients = recipe.getIngredients().stream()
                            .map(ingredient -> ingredient.getIngreName() + " (" + ingredient.getAmount() + ")")
                            .collect(Collectors.toList());

                    // 레시피의 process 개수
                    int processCount = recipe.getProcesses().size();

                    // 코사인 유사도
                    double similarity = calculateCosineSimilarity(userProfile, recipeVector);

                    return new RecipeRecommendationDto(
                            recipe.getRecipeId(),
                            recipe.getRecipeTitle(),
                            recipe.getRequiredTime(),
                            ingredients,
                            processCount,
                            similarity

                    );
                })
                .sorted(Comparator.comparingDouble(RecipeRecommendationDto::getSimilarity).reversed())
                .limit(limit)
                .collect(Collectors.toList());

        return recommendations;
    }

    // 각 레시피와의 코사인 유사도 계산
    private double calculateCosineSimilarity(Map<String, Double> vector1, Map<String, Double> vector2) {
        // 두 벡터의 모든 특성
        Set<String> allFeatures = new HashSet<>();
        allFeatures.addAll(vector1.keySet());
        allFeatures.addAll(vector2.keySet());

        // 내적 계산
        double dotProduct = allFeatures.stream()
                .mapToDouble(feature ->
                        vector1.getOrDefault(feature, 0.0) * vector2.getOrDefault(feature, 0.0))
                .sum();

        // 벡터의 크기 계산
        double norm1 = Math.sqrt(vector1.values().stream().mapToDouble(val -> val * val).sum());

        double norm2 = Math.sqrt(vector2.values().stream().mapToDouble(val -> val * val).sum());

        // 코사인 유사도 계산
        return norm1 == 0 || norm2 == 0 ? 0 : dotProduct / (norm1 * norm2);
    }
}
