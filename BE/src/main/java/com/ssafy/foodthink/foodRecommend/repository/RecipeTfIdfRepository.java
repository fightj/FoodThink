package com.ssafy.foodthink.foodRecommend.repository;

import com.ssafy.foodthink.foodRecommend.entity.RecipeTfIdf;
import com.ssafy.foodthink.recipes.entity.RecipeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecipeTfIdfRepository extends JpaRepository<RecipeTfIdf, Long> {
    void deleteByRecipe(RecipeEntity recipe);

    // 특정 레시피에 대한 모든 TF-IDF 값을 조회
    List<RecipeTfIdf> findByRecipe(RecipeEntity recipe);
}
