package com.ssafy.foodthink.foodRecommend.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecipeRecommendRequestDTO {
    private String cateType;
    private String cateMainIngre;
    private List<String> likedIngredients;
    private List<String> dislikedIngredients;
}
