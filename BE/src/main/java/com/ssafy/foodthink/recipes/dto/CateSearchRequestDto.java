package com.ssafy.foodthink.recipes.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

/*
    카테고리를 선택한 레시피 전채 목록 조회 기능
    입력용 DTO
 */

@Getter
@Setter
@AllArgsConstructor
public class CateSearchRequestDto {

    private List<String> cateTypes;         //종류별 카테고리
    private List<String> cateMainIngres;    //메인재료별 카테고리

}
