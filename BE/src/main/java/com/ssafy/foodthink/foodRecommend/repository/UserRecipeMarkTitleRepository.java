package com.ssafy.foodthink.foodRecommend.repository;

import com.ssafy.foodthink.recipeBookmark.entity.RecipeBookmarkEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRecipeMarkTitleRepository extends JpaRepository<RecipeBookmarkEntity, Long> {
    //List<UserRecipeMarkEntity> findByUser_UserId(Long userId);

}
