package com.ssafy.foodthink.recipes.controller;

import com.ssafy.foodthink.recipes.dto.*;
import com.ssafy.foodthink.recipes.service.RecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/recipes")
@RequiredArgsConstructor
public class RecipeController {

    private final RecipeService recipeService;

    //레시피 목록 조회 : 카테고리별 + 정렬
    @GetMapping("/read/recipeList")
    public List<RecipeListResponseDto> searchRecipeList(
            @ModelAttribute RecipeListRequestDto requestDto) {
        return recipeService.searchRecipeList(requestDto);
    }

//    public List<RecipeListResponseDto> searchRecipeList(
//            @ModelAttribute RecipeListRequestDto requestDto,
//            @AuthenticationPrincipal CustomUserDetails userDetails) {  // ⭐ JWT에서 사용자 정보 가져오기
//        Long userId = (userDetails != null) ? userDetails.getUserId() : null;  // 로그인 안 했으면 null
//        return recipeService.searchRecipeList(requestDto, userId);
//    } //로그인 관련 - 북마크

    //레시피 조회순 상위 20 목록 조회
    @GetMapping("read/recipeList/top20/hits")
    public List<RecipeListTop20ResponseDto> getTop20RecipesByHits() {
        return recipeService.getTop20RecipesByHits();
    }

    //레시피 추천순 목록 조회 (로그인 했을 때 사용자가 구독한 사용자의 레시피들)

    //레시피 상세 보기
    @GetMapping("read/detail/{recipeId}")
    public RecipeDetailResponseDto getRecipeDetail(@PathVariable Long recipeId) {
        return recipeService.getRecipeDetail(recipeId);
    }

}
