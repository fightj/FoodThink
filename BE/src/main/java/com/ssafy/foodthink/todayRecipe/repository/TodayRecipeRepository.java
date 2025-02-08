package com.ssafy.foodthink.todayRecipe.repository;

import com.ssafy.foodthink.recipes.entity.RecipeEntity;
import com.ssafy.foodthink.todayRecipe.dto.TodayRecipeResponseDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface TodayRecipeRepository extends JpaRepository<RecipeEntity, Long> {

    TodayRecipeResponseDto findTodayRecipeResponseDtoByRecipeId(Long recipeId);

    @Query("SELECT MAX(r.recipeId) FROM RecipeEntity r")
    Long findMaxRecipeId();

    boolean existsByRecipeId(Long recipeId); // recipeId가 존재하는지 확인
}
