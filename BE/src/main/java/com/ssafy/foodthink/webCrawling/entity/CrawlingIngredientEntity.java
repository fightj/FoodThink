package com.ssafy.foodthink.webCrawling.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "crawling_ingredient")
public class CrawlingIngredientEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ingreId;
    //자동생성 기본키
    
    private String ingreName;   //재료명
    private String amount;     //수량 및 단위

    @ManyToOne(cascade = CascadeType.ALL)   //부모 객체 CRUD 때 자식 객체도 동시에 작업 수행
    @JoinColumn(name = "recipe_id")     //외래키 컬럼 지정 (recipeId로 생성된다.)
    private CrawlingRecipeEntity crawlingRecipe;    //CrawlingRecipeEntity와 관계 설정

}
