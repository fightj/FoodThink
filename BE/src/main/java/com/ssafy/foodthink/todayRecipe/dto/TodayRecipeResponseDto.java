package com.ssafy.foodthink.todayRecipe.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TodayRecipeResponseDto {

    private Long recipeId;
    private String recipeTitle;
    private String image;
}
