package com.ssafy.foodthink.foodRecommend.dto;

import com.ssafy.foodthink.recipes.entity.RecipeEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class RecipeRecommendationDto {
    private Long recipeId;
    private String recipeTitle;
    private String requiredTime;
    private List<String> ingredients;
    private int processCount;
    private double similarity;

}




