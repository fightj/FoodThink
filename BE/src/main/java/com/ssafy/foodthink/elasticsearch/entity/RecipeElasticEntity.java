package com.ssafy.foodthink.elasticsearch.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.elasticsearch.annotations.Document;
import java.util.List;
import org.springframework.data.annotation.Id;


@Document(indexName = "recipes1")
@Getter
@Setter
public class RecipeElasticEntity {
    @Id
    private Long recipeId;
    private String recipeTitle;
    private List<String> ingredients;
}
