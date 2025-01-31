package com.ssafy.foodthink.foodRecommend.repository;

import com.ssafy.foodthink.recipes.entity.UserRecipeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRecipeTitleRepository extends JpaRepository<UserRecipeEntity, Long> {
    //List<String> findAllRecipeTitles();
}
