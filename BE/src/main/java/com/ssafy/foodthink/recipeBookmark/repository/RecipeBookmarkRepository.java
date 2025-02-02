package com.ssafy.foodthink.recipeBookmark.repository;

import com.ssafy.foodthink.recipeBookmark.entity.RecipeBookmarkEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RecipeBookmarkRepository extends JpaRepository<RecipeBookmarkEntity, Long> {

    boolean existsByUserId_UserIdAndRecipeId_RecipeId(Long userId, Long recipeId); // 해당 사용자가 해당 레시피를 북마크 했는지 여부 확인

    Optional<RecipeBookmarkEntity> findByUserId_UserIdAndRecipeId_RecipeId(Long userId, Long recipeId); // 해당 사용자의 해당 레시피 북마크를 반환
}
