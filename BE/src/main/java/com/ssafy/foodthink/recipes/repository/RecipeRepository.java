package com.ssafy.foodthink.recipes.repository;

import com.ssafy.foodthink.recipes.entity.RecipeEntity;
import com.ssafy.foodthink.user.entity.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RecipeRepository extends JpaRepository<RecipeEntity, Long> {
    //레시피 삭제 기능 : 레시피 아이디와 로그인한 사용자 아이디 확인
    Optional<RecipeEntity> findByRecipeIdAndUserEntity_UserId(Long recipeId, Long userId);

    List<RecipeEntity> findByUserEntity(UserEntity userEntity);
    List<RecipeEntity> findAllByRecipeIdInOrderByWriteTimeDesc(List<Long> ids);
    Page<RecipeEntity> findAllByRecipeIdInOrderByWriteTimeDesc(List<Long> ids, Pageable pageable);
    @Query("SELECT r FROM RecipeEntity r JOIN r.ingredients i WHERE r.recipeTitle LIKE %:recipeTitle% or i.ingreName LIKE %:ingreName%")
    List<RecipeEntity> findByNameAndIngredientNameContaining(@Param("recipeTitle") String name, @Param("ingreName") String ingredientName);
    List<RecipeEntity> findByWriteTimeAfter(LocalDateTime twentyFourHoursAgo);
    // 조회순 정렬
    @Query("SELECT r FROM RecipeEntity r WHERE r.recipeId IN :ids ORDER BY r.hits DESC")
    Page<RecipeEntity> findAllByRecipeIdInOrderByHitsDesc(@Param("ids") List<Long> ids, Pageable pageable);
    // 북마크 개수순 정렬 (JPQL로 직접 조회)
    @Query("SELECT r FROM RecipeEntity r LEFT JOIN r.recipeBookmarkEntities rb " +
            "WHERE r.recipeId IN :ids GROUP BY r ORDER BY COUNT(rb) DESC")
    Page<RecipeEntity> findAllByRecipeIdInOrderByBookmarkCountDesc(@Param("ids") List<Long> ids, Pageable pageable);
}
