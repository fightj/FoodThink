package com.ssafy.foodthink.webCrawling.repository;

import com.ssafy.foodthink.webCrawling.entity.CrawlingProcessEntity;
import com.ssafy.foodthink.webCrawling.entity.CrawlingProcessImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/*
    데이터베이스와 상호작용 처리 (JPA 기준)
 */

@Repository
public interface CrawlingProcessRepository extends JpaRepository<CrawlingProcessEntity, Long> {

    void deleteByCrawlingRecipe_RecipeId(Long recipeId);
}
