package com.ssafy.foodthink.recipes.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AllRecipeListDto {
    private Long recipeId;
    private String recipeTitle;
    private Integer hits;
    private String recipeUrl;
    private String image;
}
