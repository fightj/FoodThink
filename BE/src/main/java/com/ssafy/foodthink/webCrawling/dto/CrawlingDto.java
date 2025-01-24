package com.ssafy.foodthink.webCrawling.dto;

import lombok.Getter;
import lombok.Setter;

/*
    1차 크롤링 데이터를 CrawlingRecipeEntity로 변환하기 전에 사용한다.
 */

@Getter
@Setter
public class CrawlingDto {

    private String recipeTitle;         // 레시피 제목
    private String cateType;            // 종류별 분류
    private String cateMainIngre;       // 재료별 분류
    private String recipeUrl;           // 레시피URL
    private String image;               // 대표이미지URL

}
