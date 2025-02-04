package com.ssafy.foodthink.foodRecommend.repository;

import com.ssafy.foodthink.foodRecommend.entity.RecipeTfIdf;
import com.ssafy.foodthink.recipes.entity.RecipeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecipeTfIdfRepository extends JpaRepository<RecipeTfIdf, Long> {
    void deleteByRecipe(RecipeEntity recipe);
}
