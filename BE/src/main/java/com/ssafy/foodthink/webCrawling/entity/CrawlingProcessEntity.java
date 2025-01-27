package com.ssafy.foodthink.webCrawling.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "crawling_process_entity")
public class CrawlingProcessEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long processId;     //기본키

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "recipe_id")
    private CrawlingRecipeEntity crawlingRecipe;    //레시피ID 외래키

    private Integer processOrder;      //과정순서

    @Lob    //TEXT로 필드 처리
    private String processExplain;     //과정설명
}