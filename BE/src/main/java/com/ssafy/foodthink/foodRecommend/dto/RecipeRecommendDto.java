package com.ssafy.foodthink.foodRecommend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class RecipeRecommendDto {
    private Long recipeId;
    private String recipeTitle;
    private String cateType;
    private String requiredTime;
    private List<String> ingredients;
    private Integer level;
    private int processCount;
    private double similarity;

}




