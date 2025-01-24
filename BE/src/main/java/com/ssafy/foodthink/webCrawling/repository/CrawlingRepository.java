package com.ssafy.foodthink.webCrawling.repository;

import com.ssafy.foodthink.webCrawling.entity.CrawlingRecipeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CrawlingRepository extends JpaRepository<CrawlingRecipeEntity, Long> {
    boolean existsByRecipeUrl(String recipeUrl);
}
