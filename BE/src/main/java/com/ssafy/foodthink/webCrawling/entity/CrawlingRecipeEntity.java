package com.ssafy.foodthink.webCrawling.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class CrawlingRecipeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer recipeId;           //자동생성 기본키

    private String recipeTitle;         //레시피 제목
    private String cateType;            //종류별 분류
    private String cateMainIngre;       //재료별 분류
    private String serving;             //인분
    private Integer level;              //난이도
    private String requiredTime;        //소요시간
    private LocalDateTime writeTime;    //작성시간
    private Integer hits;               //조회수
    private String recipeUrl;           //레시피 URL
    private String crawlingId;          //크롤링ID
    private String image;               //이미지 URL

}
