package com.ssafy.foodthink.foodRecommend.entity;

import com.ssafy.foodthink.recipes.entity.RecipeEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
@Table(name = "recipe_tfidf")
public class RecipeTfIdfEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "recipe_tfidf_Id")
    private Long recipeTfidfId;

    @ManyToOne
    @JoinColumn(name = "recipe_id", nullable = false)
    private RecipeEntity recipe;

    @Column(name = "feature", nullable = false)
    private String feature; // 레시피의 종류별, 개별재료

    @Column(name = "tfidf_value")
    private Double tfIdfValue; // 해당 feature에 대한 계산된 TF-IDF 값
}


