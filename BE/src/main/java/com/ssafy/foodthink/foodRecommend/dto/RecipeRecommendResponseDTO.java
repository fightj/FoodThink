package com.ssafy.foodthink.foodRecommend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RecipeRecommendResponseDTO {
    private Long recipeId;
    private String recipeTitle;
}
