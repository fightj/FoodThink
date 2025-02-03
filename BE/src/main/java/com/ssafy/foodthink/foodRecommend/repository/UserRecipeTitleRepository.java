package com.ssafy.foodthink.foodRecommend.repository;

import com.ssafy.foodthink.recipes.entity.RecipeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRecipeTitleRepository extends JpaRepository<RecipeEntity, Long> {
    //List<String> findAllRecipeTitles();
    List<RecipeEntity> findByIsPublicTrue();
}
