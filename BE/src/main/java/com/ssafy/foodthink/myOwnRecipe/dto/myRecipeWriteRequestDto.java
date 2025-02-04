package com.ssafy.foodthink.myOwnRecipe.dto;

/*
    사용자가 작성한 레시피 정보 -> 저장
    (프론트에서 온 정보)
 */

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class myRecipeWriteRequestDto {
    private String recipeTitle;     //레시피 제목
    private String image;           //대표이미지
    private String cateType;        //종류별 카테고리
    private String cateMainIngre;   //메인재료별 카테고리
    private String serving;         //인분
    private int level;           //난이도
    private String requiredTime;    //소요시간
    private boolean isPublic;       //공개유무

    private List<String> ingredients;   //재료 정보
    private List<String> processes;     //과정 정보
    
    private Long userId;    //사용자 정보 확인용
    //과정 정보 속 이미지 처리 필요
}
