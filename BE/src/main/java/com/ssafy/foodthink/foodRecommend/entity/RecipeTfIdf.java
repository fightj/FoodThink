package com.ssafy.foodthink.foodRecommend.entity;

import com.ssafy.foodthink.recipes.entity.RecipeEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "recipe_tfidf")
@Getter
@Setter
public class RecipeTfIdf {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="tfidf_Id")
    private Long tfidfId;

    @ManyToOne
    @JoinColumn(name = "recipe_id")
    private RecipeEntity recipe;

    @Column(name="feature")
    private String feature; // 레시피의 종류별, 주재료, 개별재료명

    @Column(name="tfidf_value")
    private Double tfIdfValue; // 해당 feature에 대한 계산된 TF-IDF 값



}
