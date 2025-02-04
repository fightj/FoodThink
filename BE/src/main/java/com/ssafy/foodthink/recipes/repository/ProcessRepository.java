package com.ssafy.foodthink.recipes.repository;

import com.ssafy.foodthink.recipes.entity.IngredientEntity;
import com.ssafy.foodthink.recipes.entity.ProcessEntity;
import com.ssafy.foodthink.recipes.entity.RecipeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Arrays;
import java.util.List;

@Repository
public interface ProcessRepository extends JpaRepository<ProcessEntity, Long> {

    //수정할 레시피 조회(미리보기)용
    List<ProcessEntity> findByRecipeEntity_RecipeId(Long recipeId);
    //레시피 수정 : 기존 과정 정보 삭제
    void deleteByRecipeEntity_RecipeId(Long recipeId);
}
