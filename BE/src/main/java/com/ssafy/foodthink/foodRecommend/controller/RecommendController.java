package com.ssafy.foodthink.foodRecommend.controller;

import com.ssafy.foodthink.foodRecommend.service.RecommendInterestService;
import com.ssafy.foodthink.user.jwt.JWTUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/recommend")
//@PreAuthorize("hasRole('USER')")
public class RecommendController {

    private final RecommendInterestService recommendInterestService;
    private final JWTUtil jwtUtil;

    public RecommendController(RecommendInterestService recommendInterestService, JWTUtil jwtUtil) {
        this.recommendInterestService = recommendInterestService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/keywords")
    public ResponseEntity<String> getRecommendationKeywords(@RequestHeader("Authorization") String token) {
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);

        List<String> likedIngredients = recommendInterestService.getLikedIngredients(userId);
        List<String> dislikedIngredients = recommendInterestService.getDislikedIngredients(userId);

        // 키워드 추출 로직 (예: 단순히 콤마로 구분된 문자열로 결합)
        String keywords = String.join(", ", likedIngredients) + " | " + String.join(", ", dislikedIngredients);

        return ResponseEntity.ok(keywords);
    }

    @GetMapping("/recipe")
    public ResponseEntity<String> getRecipeRecommendation(@RequestHeader("Authorization") String token) {
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);

        String recommendation = recommendInterestService.getRecipeRecommendation(userId);

        return ResponseEntity.ok(recommendation);
    }
}
