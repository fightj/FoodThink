package com.ssafy.foodthink.webCrawling.repository;

import com.ssafy.foodthink.recipes.entity.ProcessImageEntity;
import com.ssafy.foodthink.recipes.entity.RecipeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/*
    데이터베이스와 상호작용 처리 (JPA 기준)
 */

@Repository
public interface CrawlingProcessImageRepository extends JpaRepository<ProcessImageEntity, Long> {

    void deleteByProcessEntity_RecipeEntity(RecipeEntity recipeEntity);
}
