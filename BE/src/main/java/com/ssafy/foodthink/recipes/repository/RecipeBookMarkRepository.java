package com.ssafy.foodthink.recipes.repository;

import com.ssafy.foodthink.recipes.entity.RecipeBookMark;
import com.ssafy.foodthink.recipes.entity.RecipeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecipeBookMarkRepository extends JpaRepository<RecipeBookMark, Long> {

    //북마크 개수 조회 레파지토리
    Long countByRecipeEntity(RecipeEntity recipeEntity);

}
