package com.ssafy.foodthink.webCrawling.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/*
       크롤링한 데이터를 DTO에서 Entity로 변환
       Repository를 통해 저장
       이 과정이 Serivce 계층에서 처리
       Controller는 단순 크롤링 작업 트리거 용도
 */

@Entity
@Getter
@Setter
public class CrawlingRecipeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long recipeId;
    //자동생성 기본키

    private String recipeTitle;         //레시피 제목
    private String cateType;            //종류별 분류 -> 새로 구성
    private String cateMainIngre;       //재료별 분류
    private String serving;             //인분
    private Integer level;              //난이도   -> 새로 구성
    private String requiredTime;        //소요시간
    private LocalDateTime writeTime;    //작성시간
    private Integer hits = 0;               //조회수 : 기본값 0으로 설정
    private String recipeUrl;           //레시피 URL
    private String image;               //대표이미지 URL

    //작성시간을 현재로 설정
    @PrePersist
    protected void onCreate() {
        this.writeTime = LocalDateTime.now();
    }

}
