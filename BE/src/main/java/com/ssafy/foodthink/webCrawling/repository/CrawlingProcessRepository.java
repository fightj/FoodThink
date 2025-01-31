package com.ssafy.foodthink.webCrawling.repository;

import com.ssafy.foodthink.recipes.entity.ProcessEntity;
import com.ssafy.foodthink.recipes.entity.RecipeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/*
    데이터베이스와 상호작용 처리 (JPA 기준)
 */

@Repository
public interface CrawlingProcessRepository extends JpaRepository<ProcessEntity, Long> {

    void deleteByRecipeEntity(RecipeEntity recipeEntity);

    @Modifying
    @Transactional
    void deleteByRecipeEntity_RecipeIdIn(List<Long> invalidRecipeIds);
}
