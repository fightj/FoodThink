package com.ssafy.foodthink.webCrawling.repository;

import com.ssafy.foodthink.recipes.entity.RecipeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/*
    데이터베이스와 상호작용 처리 (JPA 기준)
 */

@Repository
public interface CrawlingRecipeRepository extends JpaRepository<RecipeEntity, Long> {

    //recipeUrl을 기준으로 데이터 중복 확인
    boolean existsByRecipeUrl(String recipeUrl);

}
