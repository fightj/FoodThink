package com.ssafy.foodthink.foodRecommend.repository;

import com.ssafy.foodthink.another.UserRecipeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRecipeRepository extends JpaRepository<UserRecipeEntity, Long> {
    @Query("SELECT ur.recipeTitle FROM UserRecipeEntity ur")
    List<String> findAllRecipeTitles();
}
