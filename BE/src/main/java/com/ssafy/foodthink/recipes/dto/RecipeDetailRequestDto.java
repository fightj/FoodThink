package com.ssafy.foodthink.recipes.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

/*
    레시피 상세 보기 입력DTO
 */

@Getter
@Setter
@AllArgsConstructor
public class RecipeDetailRequestDto {

    private Long recipeId;

}
