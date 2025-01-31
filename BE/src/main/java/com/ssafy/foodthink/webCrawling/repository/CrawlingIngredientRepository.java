package com.ssafy.foodthink.webCrawling.repository;

import com.ssafy.foodthink.recipes.entity.IngredientEntity;
import com.ssafy.foodthink.recipes.entity.RecipeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/*
    데이터베이스와 상호작용 처리 (JPA 기준)
 */

@Repository
public interface CrawlingIngredientRepository extends JpaRepository<IngredientEntity, Long> {

    //재료명과 recipeUrl로 재료 정보의 중복 검사
    boolean existsByIngreNameAndRecipeEntity_RecipeUrl(String ingreName, String recipeUrl);

    void deleteByRecipeEntity(RecipeEntity recipeEntity);
}
