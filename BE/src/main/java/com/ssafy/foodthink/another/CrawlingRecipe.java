package com.ssafy.foodthink.another;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "crawlingrecipe")
public class CrawlingRecipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "recipe_id")
    private Long recipeId; // crawling_recipe_id와 매핑

    @Column(nullable = false, name = "recipe_title")
    private String recipeTitle; // 크롤링된 레시피 이름
}