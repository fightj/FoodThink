package com.ssafy.foodthink.recipes.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

/*
    전체 레시피 목록 조회 출력용 DTO
    (레시피 기능 딱 들어갔을 때 첫 페이지?)
 */

@Getter
@Setter
@AllArgsConstructor
public class AllRecipeListResponseDto {
    private Long recipeId;
    private String recipeTitle;
    private Integer hits;
    private String recipeUrl;
    private String image;
}
