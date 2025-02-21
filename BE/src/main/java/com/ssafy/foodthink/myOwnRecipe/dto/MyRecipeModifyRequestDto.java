package com.ssafy.foodthink.myOwnRecipe.dto;

/*
    사용자가 작성한 레시피 정보 -> 저장
    (프론트에서 온 정보)
 */

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.ssafy.foodthink.recipes.dto.IngredientDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
//@AllArgsConstructor
public class MyRecipeModifyRequestDto {
    private Long recipeId;
    private String recipeTitle;     //레시피 제목
    private String image;
    private String cateType;        //종류별 카테고리
    private String cateMainIngre;   //메인재료별 카테고리
    private String serving;         //인분
    private int level;           //난이도
    private String requiredTime;    //소요시간
//    @JsonProperty("isPublic")   //JSON 필드명 명시적
    private Boolean isPublic;       //공개유무

    private List<IngredientDto> ingredients;   //재료 정보
    private List<ProcessRequestDto> processes;     //과정 정보
    
    private Long userId;    //사용자 정보 확인용
    //과정 정보 속 이미지 처리 필요

    @JsonCreator
    public MyRecipeModifyRequestDto(
            @JsonProperty("recipeId") Long recipeId,
            @JsonProperty("recipeTitle") String recipeTitle,
            @JsonProperty("image") String image,
            @JsonProperty("cateType") String cateType,
            @JsonProperty("cateMainIngre") String cateMainIngre,
            @JsonProperty("serving") String serving,
            @JsonProperty("level") int level,
            @JsonProperty("requiredTime") String requiredTime,
            @JsonProperty("isPublic") Boolean isPublic,
            @JsonProperty("ingredients") List<IngredientDto> ingredients,
            @JsonProperty("processes") List<ProcessRequestDto> processes,
            @JsonProperty("userId") Long userId
    ) {
        this.recipeId = recipeId;
        this.recipeTitle = recipeTitle;
        this.image = image;
        this.cateType = cateType;
        this.cateMainIngre = cateMainIngre;
        this.serving = serving;
        this.level = level;
        this.requiredTime = requiredTime;
        this.isPublic = isPublic;
        this.ingredients = ingredients;
        this.processes = processes;
        this.userId = userId;
    }

}
