package com.ssafy.foodthink.recipes.controller;

import com.ssafy.foodthink.recipes.dto.RecipeListRequestDto;
import com.ssafy.foodthink.recipes.dto.RecipeListResponseDto;
import com.ssafy.foodthink.recipes.dto.RecipeListTop20ResponseDto;
import com.ssafy.foodthink.recipes.service.RecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/recipes")
@RequiredArgsConstructor
public class RecipeController {

    private final RecipeService recipeService;

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

    @GetMapping("read/recipeList/top20/hits")
    public List<RecipeListTop20ResponseDto> getTop20RecipesByHits() {
        return recipeService.getTop20RecipesByHits();
    }

}
