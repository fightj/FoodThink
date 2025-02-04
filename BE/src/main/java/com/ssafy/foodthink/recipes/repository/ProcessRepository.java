package com.ssafy.foodthink.recipes.repository;

import com.ssafy.foodthink.recipes.entity.IngredientEntity;
import com.ssafy.foodthink.recipes.entity.ProcessEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Arrays;
import java.util.List;

@Repository
public interface ProcessRepository extends JpaRepository<ProcessEntity, Long> {

    //수정할 레시피 조회(미리보기)용
    List<ProcessEntity> findByRecipeEntity_RecipeId(Long recipeId);
}
