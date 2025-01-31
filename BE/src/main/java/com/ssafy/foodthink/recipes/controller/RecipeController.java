package com.ssafy.foodthink.recipes.controller;

import com.ssafy.foodthink.recipes.dto.AllRecipeListResponseDto;
import com.ssafy.foodthink.recipes.service.RecipeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RecipeController {

    private final RecipeService recipeService;

    @Autowired
    public RecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    ///  //////////////////////////////////

    //모든 레시피 목록 조회 : 최신순
    @GetMapping("/recipes/latest/read")
    public ResponseEntity<Page<AllRecipeListResponseDto>> getLatestRecipes(
            @RequestParam(defaultValue = "0") int page,         //0쪽부터
            @RequestParam(defaultValue = "20") int size) {      //20개씩
        PageRequest pageable = PageRequest.of(page, size);
        Page<AllRecipeListResponseDto> recipes = recipeService.findAllRecipes("latest", pageable);
        return ResponseEntity.ok(recipes);
    }

    //모든 레시피 목록 조회 : 조회순
    @GetMapping("/recipes/hits/read")
    public ResponseEntity<Page<AllRecipeListResponseDto>> getHitsRecipes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PageRequest pageable = PageRequest.of(page, size);
        Page<AllRecipeListResponseDto> recipes = recipeService.findAllRecipes("hits", pageable);
        return ResponseEntity.ok(recipes);
    }

    //모든 레시피 목록 조회 : 난이도순
    @GetMapping("/recipes/level/read")
    public ResponseEntity<Page<AllRecipeListResponseDto>> getLevelRecipes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PageRequest pageable = PageRequest.of(page, size);
        Page<AllRecipeListResponseDto> recipes = recipeService.findAllRecipes("level", pageable);
        return ResponseEntity.ok(recipes);
    }

    ///  //////////////////////////////////
    
    //레시피 상세 조회 관련 기능 구현 예정

    ///  //////////////////////////////////

    ///  //////////////////////////////////

    ///  //////////////////////////////////

    ///  //////////////////////////////////

    ///  //////////////////////////////////

}
