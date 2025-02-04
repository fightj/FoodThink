package com.ssafy.foodthink.recipes.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

/*
    레시피 상세 보기 출력 DTO
 */

@Getter
@Setter
@AllArgsConstructor
public class RecipeDetailResponseDto {
    private Long recipeId;
    private String recipeTitle;
    private String image;
    private String nickname;
    private String userImage;
    private String serving; //인분
    private Integer level;   //난이도
    private String requiredTime;    //소요시간
    private Integer hits;       //조회수

    //재료 정보
    private List<IngredientDto> ingredients;
    //과정 정보 (이미지 포함)
    private List<ProcessDto> processes;

}
