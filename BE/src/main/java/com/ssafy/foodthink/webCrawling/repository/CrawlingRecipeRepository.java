package com.ssafy.foodthink.webCrawling.repository;

import com.ssafy.foodthink.recipes.entity.RecipeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/*
    데이터베이스와 상호작용 처리 (JPA 기준)
 */

@Repository
public interface CrawlingRecipeRepository extends JpaRepository<RecipeEntity, Long> {

    //recipeUrl을 기준으로 데이터 중복 확인
    boolean existsByRecipeUrl(String recipeUrl);

    //ingredient 테이블에 존재하지 않는 경우의 recipe_id 목록 가져오기
    @Query("SELECT r.recipeId FROM RecipeEntity r WHERE r.recipeId NOT IN (SELECT i.recipeEntity.recipeId FROM IngredientEntity i)")
    List<Long> findRecipeIdsWithoutIngredients();

    @Modifying
    @Transactional
    void deleteByRecipeIdIn(List<Long> invalidRecipeIds);
}
