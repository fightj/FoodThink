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

    // 조회순 정렬 (hits 기준) + 카테고리 필터링 (선택하지 않으면 전체 검색)
    @Query("SELECT r FROM RecipeEntity r WHERE r.recipeId IN :ids " +
            "AND (:cateType IS NULL OR :cateType = '' OR r.cateType = :cateType) " +
            "AND (:cateMainIngre IS NULL OR :cateMainIngre = '' OR r.cateMainIngre = :cateMainIngre) " +
            "ORDER BY r.hits DESC")
    Page<RecipeEntity> findAllByRecipeIdInOrderByHitsDesc(
            @Param("ids") List<Long> ids,
            @Param("cateType") String cateType,
            @Param("cateMainIngre") String cateMainIngre,
            Pageable pageable
    );

    // 북마크 개수순 정렬 + 카테고리 필터링 (선택하지 않으면 전체 검색)
    @Query("SELECT r FROM RecipeEntity r LEFT JOIN r.recipeBookmarkEntities rb " +
            "WHERE r.recipeId IN :ids " +
            "AND (:cateType IS NULL OR :cateType = '' OR r.cateType = :cateType) " +
            "AND (:cateMainIngre IS NULL OR :cateMainIngre = '' OR r.cateMainIngre = :cateMainIngre) " +
            "GROUP BY r ORDER BY COUNT(rb) DESC")
    Page<RecipeEntity> findAllByRecipeIdInOrderByBookmarkCountDesc(
            @Param("ids") List<Long> ids,
            @Param("cateType") String cateType,
            @Param("cateMainIngre") String cateMainIngre,
            Pageable pageable
    );

    // 작성시간순 정렬 + 카테고리 필터링 (선택하지 않으면 전체 검색)
    @Query("SELECT r FROM RecipeEntity r WHERE r.recipeId IN :ids " +
            "AND (:cateType IS NULL OR :cateType = '' OR r.cateType = :cateType) " +
            "AND (:cateMainIngre IS NULL OR :cateMainIngre = '' OR r.cateMainIngre = :cateMainIngre) " +
            "ORDER BY r.writeTime DESC")
    Page<RecipeEntity> findAllByRecipeIdInOrderByWriteTimeDesc(
            @Param("ids") List<Long> ids,
            @Param("cateType") String cateType,
            @Param("cateMainIngre") String cateMainIngre,
            Pageable pageable
    );

    RecipeEntity findByRecipeId(Long recipeId);

    //닉네임으로 사용자 아이디 찾기 : 어떤 사용자가 작성한 레시피 목록 조회 최신순 (마이페이지)
    List<RecipeEntity> findByUserEntity_UserIdOrderByWriteTimeDesc(Long userId);

    @Query("SELECT r from RecipeEntity r where r.userEntity.userId IN " +
            "(SELECT s.subscribedUser.userId from SubscribeEntity s " +
            "where s.subscriber.userId = :userId)")
    List<RecipeEntity> findSubscribedRecipes(@Param("userId") Long userId);

}