package com.ssafy.foodthink.foodRecommend.repository;

import com.ssafy.foodthink.foodRecommend.entity.RecipeTfIdfEntity;
import com.ssafy.foodthink.recipes.entity.RecipeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface RecipeTfIdfRepository extends JpaRepository<RecipeTfIdfEntity, Long> {

    void deleteByRecipeEntity(RecipeEntity recipeEntity); // 특정 레시피와 관련된 모든 TF-IDF 값을 DB에서 삭제

    // 특정 레시피에 대한 모든 TF-IDF 값을 조회
    List<RecipeTfIdfEntity> findByRecipeEntity(RecipeEntity recipe);

    // TF-IDF 값을 DB에 삽입하거나 업데이트
    @Modifying
    @Query(value = """
        INSERT INTO recipe_tfidf (recipe_id, feature, tfidf_value) 
        VALUES (:recipeId, :feature, :value)
        ON DUPLICATE KEY UPDATE 
            tfidf_value = VALUES(tfidf_value)
        """, nativeQuery = true)
    @Transactional
    void upsertTfIdf(@Param("recipeId") Long recipeId,
                     @Param("feature") String feature,
                     @Param("value") Double value);
}

