package com.ssafy.foodthink.foodRecommend.controller;

import com.ssafy.foodthink.foodRecommend.dto.RecipeRecommendDto;
import com.ssafy.foodthink.foodRecommend.dto.RecipeRecommendResponseDTO;
import com.ssafy.foodthink.foodRecommend.dto.UserLikedInputDto;
import com.ssafy.foodthink.foodRecommend.repository.RecipeTfIdfRepository;
import com.ssafy.foodthink.foodRecommend.repository.UserTfIdfRepository;
import com.ssafy.foodthink.foodRecommend.service.FoodRecommendGPTService;
import com.ssafy.foodthink.foodRecommend.service.RecipeRecommendService;
import com.ssafy.foodthink.foodRecommend.service.RecipeTFIDFService;
import com.ssafy.foodthink.foodRecommend.service.UserTFIDFService;
import com.ssafy.foodthink.recipes.repository.RecipeRepository;
import com.ssafy.foodthink.user.jwt.JWTUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/recommend")
//@PreAuthorize("hasRole('USER')")
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
    private final UserTfIdfRepository userTfIdfRepository;

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

    // 모든 레시피 TF-IDF 계산 (수동 계산)
    @PostMapping("/update/recipe")
    public ResponseEntity<String> calculateTfIdf() {
        tfidfService.calculateAndSaveAllTfIdf();
        log.info("==TF-IDF 계산 및 DB에 저장 완료==");
        return ResponseEntity.ok("TF-IDF 계산 및 DB에 저장 완료 ");
    }

    // 사용자 TF-IDF 계산 (수동 계산)
    @GetMapping("/update/user")
    public ResponseEntity<Map<String, Double>> updateUserProfile(@RequestHeader("Authorization") String token) {
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);

        userTFIDFService.updateUserTfidf(userId);

        Map<String, Double> userProfile = userTFIDFService.getUserTfIdfProfile(userId);

        return ResponseEntity.ok(userProfile);
    }

    // 코사인 유사도로 레시피 추천
    @GetMapping("/create/similar")
    public ResponseEntity<List<RecipeRecommendDto>> getRecommendedRecipes(@RequestHeader("Authorization") String token, @RequestParam(defaultValue = "10") int limit) {
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);

        // 사용자 TF-IDF 계산 및 DB 저장
        //userTFIDFService.updateUserTfidf(userId);

        List<RecipeRecommendDto> recommendations = recipeRecommendService.getRecommendedRecipes(userId, limit);

        return ResponseEntity.ok(recommendations);
    }

    // apt api로 2차 필터링
    @PostMapping("/final-recommend")
    public ResponseEntity<List<RecipeRecommendResponseDTO>> getFinalRecommendation(@RequestHeader("Authorization") String token, @RequestBody UserLikedInputDto userInput) {
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);

        // CBF 기반 1차 필터링 (레시피 10개 선정)
        List<RecipeRecommendDto> recommendations = recipeRecommendService.getRecommendedRecipes(userId, 10);
        log.info("== CBF 기반 1차 필터링 완료 ==");
        // GPT 기반 2차 필터링 (레시피 3개 선정)
        List<Long> recommendedIds = gptService.getRecipeRecommendation(recommendations, userInput);
        log.info("== GPT 기반 2차 필터링 완료 ==");

        List<RecipeRecommendResponseDTO> response = recommendedIds.stream()
                .map(id -> recipeRepository.findById(id))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .map(recipe -> new RecipeRecommendResponseDTO(
                        recipe.getRecipeId(),
                        recipe.getRecipeTitle(),
                        recipe.getImage()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(response); // 레시피 ID, 레시피 제목, 레시피 메인 사진
    }


    // 날씨 API 테스트
    @GetMapping("/weather")
    public ResponseEntity<String> testWeatherApi(@RequestParam(defaultValue = "Seoul") String city) {
        String weatherInfo = gptService.getWeatherInfo(city);
        return ResponseEntity.ok(weatherInfo);
    }



}