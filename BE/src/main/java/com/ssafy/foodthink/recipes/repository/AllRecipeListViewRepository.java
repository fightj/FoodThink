package com.ssafy.foodthink.recipes.repository;

import com.ssafy.foodthink.recipes.entity.AllRecipeListViewEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface AllRecipeListViewRepository extends JpaRepository<AllRecipeListViewEntity, String> {

    //모든 레시피 최신순 조회
    @Query("SELECT r FROM AllRecipeListViewEntity r ORDER BY r.writeTime")
    Page<AllRecipeListViewEntity> findAllByLatest(Pageable pageable);

    //모든 레시피 조회순 조회
    @Query("SELECT r FROM AllRecipeListViewEntity r ORDER BY r.hits")
    Page<AllRecipeListViewEntity> findAllByHits(Pageable pageable);

    //모든 레시피 난이도순 조회
    @Query("SELECT r FROM AllRecipeListViewEntity r ORDER BY r.level")
    Page<AllRecipeListViewEntity> findAllByLevel(Pageable pageable);

}
