package com.ssafy.foodthink.recipes.repository;

import com.ssafy.foodthink.webCrawling.entity.CrawlingRecipeEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CrawlingRecipesRepository extends JpaRepository<CrawlingRecipeEntity, Long> {
    //크롤링레시피 테이블에서 모든 레시피 최신순 조회
    @Query("SELECT r FROM CrawlingRecipeEntity r ORDER BY r.writeTime DESC")
    Page<CrawlingRecipeEntity> findCrawlingRecipesByWriteTime(Pageable pageable);

    //크롤링레시피 테이블에서 모든 레시피 조회수순 조회
    @Query("SELECT r FROM CrawlingRecipeEntity r ORDER BY r.hits DESC")
    Page<CrawlingRecipeEntity> findCrawlingRecipesByHits(Pageable pageable);

    //크롤링레시피 테이블에서 모든 레시피 난이도순 조회
    @Query("SELECT r FROM CrawlingRecipeEntity r ORDER BY r.level ASC")
    Page<CrawlingRecipeEntity> findCrawlingRecipesByLevel(Pageable pageable);
}
