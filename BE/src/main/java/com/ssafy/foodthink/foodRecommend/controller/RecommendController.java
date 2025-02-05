package com.ssafy.foodthink.foodRecommend.controller;

import com.ssafy.foodthink.foodRecommend.dto.RecipeRecommendDto;
import com.ssafy.foodthink.foodRecommend.dto.RecipeRecommendResponseDTO;
import com.ssafy.foodthink.foodRecommend.dto.UserLikedInputDto;
import com.ssafy.foodthink.foodRecommend.repository.RecipeTfIdfRepository;
import com.ssafy.foodthink.foodRecommend.service.FoodRecommendGPTService;
import com.ssafy.foodthink.foodRecommend.service.RecipeRecommendService;
import com.ssafy.foodthink.foodRecommend.service.RecipeTFIDFService;
import com.ssafy.foodthink.foodRecommend.service.UserTFIDFService;
import com.ssafy.foodthink.recipes.repository.RecipeRepository;
import com.ssafy.foodthink.user.jwt.JWTUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/recommend")
@PreAuthorize("hasRole('USER')")
@RequiredArgsConstructor
public class RecommendController {

    //private final RecommendInterestService recommendInterestService;
    private final JWTUtil jwtUtil;

    private final RecipeTFIDFService tfidfService;
    private final RecipeRepository recipeRepository;
    private final RecipeTfIdfRepository recipeTfIdfRepository;
    private final UserTFIDFService userTFIDFService;
    private final RecipeRecommendService recipeRecommendService;
    private final FoodRecommendGPTService gptService;

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
    public ResponseEntity<List<RecipeRecommendDto>> getRecommendedRecipes(@RequestHeader("Authorization") String token, @RequestParam(defaultValue = "10") int limit) {
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);

        List<RecipeRecommendDto> recommendations =
                recipeRecommendService.getRecommendedRecipes(userId, limit);

        return ResponseEntity.ok(recommendations);
    }

    // apt api로 2차 필터링
    @PostMapping("/final-recommend") // GET → POST 변경
    public ResponseEntity<List<RecipeRecommendResponseDTO>> getFinalRecommendation(@RequestHeader("Authorization") String token,@RequestBody UserLikedInputDto userInput) {
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);


        // 코사인 유사도 기반 추천(1차 필터링)
        List<RecipeRecommendDto> recommendations =
                recipeRecommendService.getRecommendedRecipes(userId, 10);

        // GPT API로 2차 필터링
        String gptResponse = gptService.getRecipeRecommendation(recommendations, userInput);

        List<RecipeRecommendResponseDTO> response = recommendations.stream()
                .filter(rec -> gptResponse.contains(rec.getRecipeTitle()))
                .map(rec -> new RecipeRecommendResponseDTO(rec.getRecipeId(), rec.getRecipeTitle()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

}