package com.ssafy.foodthink.foodRecommend.repository;

import com.ssafy.foodthink.another.CrawlingRecipeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CrawlingRecipeRepository extends JpaRepository<CrawlingRecipeEntity, Long> {
    @Query("SELECT cr.recipeTitle FROM CrawlingRecipeEntity cr")
    List<String> findAllRecipeTitles();
}
