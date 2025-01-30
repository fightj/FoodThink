package com.ssafy.foodthink.foodRecommend.repository;

import com.ssafy.foodthink.another.UserRecipeMarkEntity;
import com.ssafy.foodthink.foodRecommend.dto.RecipeInfoDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRecipeMarkRepository extends JpaRepository<UserRecipeMarkEntity, Long> {
    @Query("SELECT new com.ssafy.foodthink.foodRecommend.dto.RecipeInfoDto(ur.recipeTitle, ur.cateType, ur.cateMainIngr) FROM UserRecipe ur JOIN UserRecipeMark urm ON ur.recipeId = urm.recipeId WHERE urm.userId = :userId")
    List<RecipeInfoDto> findRecipeInfoByUserId(@Param("userId") Long userId);
}
