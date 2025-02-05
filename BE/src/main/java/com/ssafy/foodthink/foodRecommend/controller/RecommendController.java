package com.ssafy.foodthink.foodRecommend.controller;

import com.ssafy.foodthink.foodRecommend.dto.RecipeRecommendationDto;
import com.ssafy.foodthink.foodRecommend.repository.RecipeTfIdfRepository;
import com.ssafy.foodthink.foodRecommend.service.RecipeRecommendService;
import com.ssafy.foodthink.foodRecommend.service.RecipeTFIDFService;
import com.ssafy.foodthink.foodRecommend.service.RecommendInterestService;
import com.ssafy.foodthink.foodRecommend.service.UserTFIDFService;
import com.ssafy.foodthink.recipes.repository.RecipeRepository;
import com.ssafy.foodthink.user.jwt.JWTUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recommend")
@PreAuthorize("hasRole('USER')")
//@PreAuthorize("hasRole('USER')")
@RequiredArgsConstructor
public class RecommendController {

    private final RecommendInterestService recommendInterestService;
    private final JWTUtil jwtUtil;

    private final RecipeTFIDFService tfidfService;
    private final RecipeRepository recipeRepository;
    private final RecipeTfIdfRepository recipeTfIdfRepository;
    private final UserTFIDFService userTFIDFService;
    private final RecipeRecommendService recipeRecommendService;

    // 선호 재료, 기피 재료 추출
    @GetMapping("/keywords")
    public ResponseEntity<String> getRecommendationKeywords(@RequestHeader("Authorization") String token) {
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);

        List<String> likedIngredients = userTFIDFService.getLikedIngredients(userId);
        List<String> dislikedIngredients = userTFIDFService.getDislikedIngredients(userId);

        // 키워드 추출
        String keywords = String.join(", ", likedIngredients) + " | " + String.join(", ", dislikedIngredients);

        return ResponseEntity.ok(keywords);
    }

//    @GetMapping("/recipe")
//    public ResponseEntity<String> getRecipeRecommendation(@RequestHeader("Authorization") String token) {
//        String accessToken = token.replace("Bearer ", "");
//        Long userId = jwtUtil.getUserId(accessToken);
//
//        String recommendation = recommendInterestService.getRecipeRecommendation(userId);
//
//        return ResponseEntity.ok(recommendation);
//    }

    // 모든 레시피 TF-IDF 계산
    @PostMapping("/create/recipe")
    public ResponseEntity<String> calculateTfIdf() {
        tfidfService.calculateAndSaveAllTfIdf();
        return ResponseEntity.ok("TF-IDF 계산 및 DB에 저장 완료 ");
    }

    // 사용자 TF-IDF 계산
    @GetMapping("/create/user")
    public ResponseEntity<Map<String, Double>> getUserProfile(@RequestHeader("Authorization") String token) {
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);

        Map<String, Double> userProfile = userTFIDFService.generateUserProfile(userId);
        return ResponseEntity.ok(userProfile);
    }

    // 코사인 유사도로 레시피 추천
    @GetMapping("/create/similar")
    public ResponseEntity<List<RecipeRecommendationDto>> getRecommendedRecipes(@RequestHeader("Authorization") String token, @RequestParam(defaultValue = "10") int limit) {
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);

        List<RecipeRecommendationDto> recommendations =
                recipeRecommendService.getRecommendedRecipes(userId, limit);

        return ResponseEntity.ok(recommendations);
    }

//    @GetMapping("/recipe/{recipeId}")
//    public ResponseEntity<Map<String, Double>> getTfIdfForRecipe(@PathVariable Long recipeId) {
//        RecipeEntity recipe = recipeRepository.findById(recipeId)
//                .orElseThrow(() -> new RuntimeException("레시피를 찾을 수 없어요"));
//
//        List<RecipeTfIdf> tfIdfValues = recipeTfIdfRepository.findByRecipe(recipe);
//        Map<String, Double> tfIdfMap = tfIdfValues.stream()
//                .collect(Collectors.toMap(RecipeTfIdf::getFeature, RecipeTfIdf::getTfIdfValue));
//
//        return ResponseEntity.ok(tfIdfMap);
//    }
//
//    @GetMapping("/top-features")
//    public ResponseEntity<List<Map.Entry<String, Double>>> getTopFeatures(@RequestParam(defaultValue = "10") int limit) {
//        List<RecipeTfIdf> allTfIdf = recipeTfIdfRepository.findAll();
//        Map<String, Double> featureAverages = allTfIdf.stream()
//                .collect(Collectors.groupingBy(RecipeTfIdf::getFeature,
//                        Collectors.averagingDouble(RecipeTfIdf::getTfIdfValue)));
//
//        List<Map.Entry<String, Double>> topFeatures = featureAverages.entrySet().stream()
//                .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
//                .limit(limit)
//                .collect(Collectors.toList());
//
//        return ResponseEntity.ok(topFeatures);
//    }
}