package com.ssafy.foodthink.todayRecommend.repository;

import com.ssafy.foodthink.recipes.entity.RecipeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface TodayRecipeRepository extends JpaRepository<RecipeEntity, Long> {


    RecipeEntity findByRecipeId(Long recipeId);

    @Query("SELECT MAX(r.recipeId) FROM RecipeEntity r")
    Long findMaxRecipeId();

    boolean existsByRecipeId(Long recipeId); // recipeId가 존재하는지 확인
}
