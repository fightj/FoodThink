package com.ssafy.foodthink.recipeBookmark.repository;

import com.ssafy.foodthink.recipeBookmark.entity.RecipeBookmarkEntity;
import com.ssafy.foodthink.recipes.entity.RecipeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecipeBookmarkRepository extends JpaRepository<RecipeBookmarkEntity, Long> {
    //특정 레시피에 대한 북마크 수 조회
    Long countByRecipeEntity(RecipeEntity recipeEntity);

    boolean existsByUserEntity_UserIdAndRecipeEntity_RecipeId(Long userId, Long recipeId); // 해당 사용자가 해당 레시피를 북마크 했는지 여부 확인

    Optional<RecipeBookmarkEntity> findByUserEntity_UserIdAndRecipeEntity_RecipeId(Long userId, Long recipeId); // 해당 사용자의 해당 레시피 북마크를 반환

    List<RecipeBookmarkEntity> findByUserEntity_UserId(Long userId); // 해당 사용자가 북마크한 레시피 목록
}
