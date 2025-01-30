package com.ssafy.foodthink.foodRecommend.repository;

import com.ssafy.foodthink.another.CrawlingMarkEntity;
import com.ssafy.foodthink.foodRecommend.dto.RecipeInfoDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CrawlingMarkRepository extends JpaRepository<CrawlingMarkEntity, Long> {
    @Query("SELECT new com.ssafy.foodthink.foodRecommend.dto.RecipeInfoDto(cr.recipeTitle, cr.cateType, cr.cateMainIngr) FROM CrawlingRecipe cr JOIN CrawlingMark cm ON cr.recipeId = cm.recipeId WHERE cm.userId = :userId")
    List<RecipeInfoDto> findRecipeInfoByUserId(@Param("userId") Long userId);
}
