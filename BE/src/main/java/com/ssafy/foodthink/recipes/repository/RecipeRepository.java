package com.ssafy.foodthink.recipes.repository;

import com.ssafy.foodthink.recipes.entity.RecipeEntity;
import com.ssafy.foodthink.user.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecipeRepository extends JpaRepository<RecipeEntity, Long> {
    //레시피 삭제 기능 : 레시피 아이디와 로그인한 사용자 아이디 확인
    Optional<RecipeEntity> findByRecipeIdAndUserEntity_UserId(Long recipeId, Long userId);

    List<RecipeEntity> findByUserEntity(UserEntity userEntity);
    List<RecipeEntity> findAllByRecipeIdInOrderByWriteTimeDesc(List<Long> ids);
    @Query("SELECT r FROM RecipeEntity r JOIN r.ingredients i WHERE r.recipeTitle LIKE %:recipeTitle% or i.ingreName LIKE %:ingreName%")
    List<RecipeEntity> findByNameAndIngredientNameContaining(@Param("recipeTitle") String name, @Param("ingreName") String ingredientName);
}
