package com.ssafy.foodthink.recipeBookmark.repository;

import com.ssafy.foodthink.recipeBookmark.entity.RecipeBookmarkEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RecipeBookmarkRepository extends JpaRepository<RecipeBookmarkEntity, Long> {

    boolean existsByUserId_UserIdAndRecipeId_RecipeId(Long userId, Long recipeId);

}
