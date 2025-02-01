package com.ssafy.foodthink.recipes.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

/*
    모든 레시피 목록 조회
    프론트에서 받아올 입력값 -> 사용자의 검색 필터 내용
 */

@Getter
@Setter
@AllArgsConstructor
public class RecipeListRequestDto {
    private String cateType = null;        //종류별 카테고리 (선택)
    private String cateMainIngre = null;   //재료별 카테고리 (선택)
    private String sortType = "hits";        //정렬 기준 (조회순, 최신순, 북마크순)
}
