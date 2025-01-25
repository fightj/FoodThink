package com.ssafy.foodthink.webCrawling.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

/*
    1차 크롤링 데이터를 CrawlingRecipeEntity로 변환하기 전에 임시 저장하는 객체
 */

@Getter
@Setter
public class CrawlingRecipeDto {

    private String recipeTitle;         // 레시피 제목
    private String cateType;            // 종류별 분류
    private String cateMainIngre;       // 재료별 분류
    private String recipeUrl;           // 레시피URL
    private String image;               // 대표이미지URL

    private String serving;             //인분
    private Integer level;               // 난이도 (아무나, 초급, 중급 등)
    private String requiredTime;        //소요시간
    
    private List<CrawlingIngredientDto> ingredients; // 재료 목록
    private List<CrawlingProcessDto> processes;      // 과정 목록
    
}
