package com.ssafy.foodthink.webCrawling.repository;

import com.ssafy.foodthink.webCrawling.entity.CrawlingRecipeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

//본래 Long 되어 있는데 Integer로... 확인 필요.

@Repository
public interface CrawlingRecipeRepository extends JpaRepository<CrawlingRecipeEntity, Integer> {
    //중복 체크 메서드
    boolean existsByRecipeUrl(String recipeUrl);
}
