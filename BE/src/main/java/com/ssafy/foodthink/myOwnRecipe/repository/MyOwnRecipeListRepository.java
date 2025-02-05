package com.ssafy.foodthink.myOwnRecipe.repository;

import com.ssafy.foodthink.recipes.entity.RecipeEntity;
import com.ssafy.foodthink.user.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MyOwnRecipeListRepository extends JpaRepository<RecipeEntity, Long> {
    //로그인한 사용자가 작성한 레시피 목록 조회
    List<RecipeEntity> findByUserEntity(UserEntity userEntity);
}
