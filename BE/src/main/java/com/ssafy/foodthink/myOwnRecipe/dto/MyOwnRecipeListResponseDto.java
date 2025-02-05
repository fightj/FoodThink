package com.ssafy.foodthink.myOwnRecipe.dto;

/*
    내가 작성한 레시피 목록 조회 (북마크순)
 */

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/*
    내가 작성한 레시피 목록 조회
    (마이페이지 사용?)
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MyOwnRecipeListResponseDto {
    private Long recipeId;
    private String recipeTitle;
    private String image;       //대표 이미지
    private Integer hits;
    private Integer bookmarkCount;
}
