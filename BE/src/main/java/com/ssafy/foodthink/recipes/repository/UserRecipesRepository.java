//package com.ssafy.foodthink.recipes.repository;
//
//import com.ssafy.foodthink.recipes.entity.RecipeEntity;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.stereotype.Repository;
//
//@Repository
//public interface UserRecipesRepository extends JpaRepository<RecipeEntity, Long> {
//
//    //나만의레시피 테이블에서 모든 레시피 최신순 조회
//    @Query("select r from UserRecipeEntity r where r.isPublic=true order by r.writeTime desc")
//    Page<RecipeEntity> findPublicRecipesByWriteTime(Pageable pageable);
//
//    //나만의레시피 테이블에서 모든 레시피 조회순 조회
//    @Query("SELECT r FROM UserRecipeEntity r WHERE r.isPublic = true ORDER BY r.hits DESC")
//    Page<RecipeEntity> findPublicRecipesByHits(Pageable pageable);
//
//    //나만의레시피 테이블에서 모든 레시피 난이도순 조회
//    @Query("SELECT r FROM UserRecipeEntity r WHERE r.isPublic = true ORDER BY r.level ASC")
//    Page<RecipeEntity> findPublicRecipesByLevel(Pageable pageable);
//}
