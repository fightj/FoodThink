package com.ssafy.foodthink.myOwnRecipe.dto;

/*
    수정 기능에서 기존의 사용자가 작성한 정보 조회
 */

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ssafy.foodthink.recipes.dto.IngredientDto;
import com.ssafy.foodthink.recipes.dto.ProcessDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MyRecipeModifyReadResponseDto {
    private Long recipeId;
    private String recipeTitle;
    private String image;           //대표이미지
    private String cateType;
    private String cateMainIngre;
    private String serving;         //인분
    private Integer level;          //난이도
    private String requiredTime;    //소요시간
    @JsonProperty("isPublic")
    private boolean isPublic;       //공개유무

    //재료 정보
    private List<IngredientDto> ingredients;
    //과정 정보 (이미지 포함)
    private List<ProcessDto> processes;
}
