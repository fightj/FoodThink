package com.ssafy.foodthink.recipes.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

/*
    레시피 목록 조회 페이지네이션 정보
    프론트용
 */

@Getter
@Setter
@AllArgsConstructor
public class RecipeListPageResponseDto {
    private List<RecipeListResponseDto> recipes;    //레시피 목록
    private int totalRecipes;                       //총 레시피 수
    private int totalPages;                         //총 페이지 수
    private int currentPage;                        //현재 페이지
}
