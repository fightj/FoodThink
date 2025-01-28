package com.ssafy.foodthink.recipes.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

/*
    레시피 상세 조회 입력용 DTO
    (레시피ID를 받아서 해당 레시피의 세부 정보 제공)
 */

@Getter
@Setter
@AllArgsConstructor
public class RecipeIdRequestDto {
    private Long recipeId;
}
