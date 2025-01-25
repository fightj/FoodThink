package com.ssafy.foodthink.webCrawling.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CrawlingIngredientDto {

    private String ingreName;   // 재료명
    private String amount;      // 수량 및 단위

}
