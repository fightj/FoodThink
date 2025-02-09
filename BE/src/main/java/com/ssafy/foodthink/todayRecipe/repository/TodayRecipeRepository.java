package com.ssafy.foodthink.todayRecipe.repository;

import com.ssafy.foodthink.recipes.entity.RecipeEntity;
import com.ssafy.foodthink.todayRecipe.dto.TodayRecipeResponseDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TodayRecipeRepository extends JpaRepository<RecipeEntity, Long> {


    RecipeEntity findByRecipeId(Long recipeId);

    @Query("SELECT MAX(r.recipeId) FROM RecipeEntity r")
    Long findMaxRecipeId();

    boolean existsByRecipeId(Long recipeId); // recipeId가 존재하는지 확인
}
