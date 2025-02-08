package com.ssafy.foodthink.elasticsearch.elasticsearchrepository;

import com.ssafy.foodthink.elasticsearch.entity.RecipeElasticEntity;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;

public interface ElasticSearchRecipeRepository extends ElasticsearchRepository<RecipeElasticEntity, String> {
    List<RecipeElasticEntity> findByRecipeTitleContainingIgnoreCaseOrIngredientsContainingIgnoreCase(String recipeTitle, String ingredients);
}
