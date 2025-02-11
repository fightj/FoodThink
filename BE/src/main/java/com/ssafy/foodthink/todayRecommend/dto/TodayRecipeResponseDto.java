package com.ssafy.foodthink.todayRecommend.dto;

import lombok.*;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
public class TodayRecipeResponseDto {

    private Long recipeId;
    private String recipeTitle;
    private String image;
}
