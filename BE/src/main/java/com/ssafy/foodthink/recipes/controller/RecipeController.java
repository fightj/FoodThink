package com.ssafy.foodthink.recipes.controller;

import com.ssafy.foodthink.recipes.dto.RecipeListRequestDto;
import com.ssafy.foodthink.recipes.dto.RecipeListResponseDto;
import com.ssafy.foodthink.recipes.service.RecipeService;
import lombok.RequiredArgsConstructor;
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
    public List<RecipeListResponseDto> searchRecipeList(@ModelAttribute RecipeListRequestDto requestDto) {
        return recipeService.searchRecipeList(requestDto);
    }

}
