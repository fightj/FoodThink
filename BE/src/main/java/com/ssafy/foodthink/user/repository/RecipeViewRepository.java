package com.ssafy.foodthink.user.repository;

import com.ssafy.foodthink.foodRecommend.entity.RecipeTfIdfEntity;
import com.ssafy.foodthink.recipes.entity.RecipeEntity;
import com.ssafy.foodthink.user.entity.RecipeViewHistoryEntity;
import com.ssafy.foodthink.user.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Pageable;
import java.util.List;

@Repository
public interface RecipeViewRepository extends JpaRepository<RecipeViewHistoryEntity, Long> {

    List<RecipeViewHistoryEntity> findByUserEntity(UserEntity user, Pageable pageable); // 사용자가 최근 본 레시피 조회

    List<RecipeViewHistoryEntity> findByUserEntity(UserEntity user); // 사용자가 조회한 모든 레시피

    List<RecipeViewHistoryEntity> findByUserEntity_userId(Long userId);

    void deleteByUserEntity(UserEntity userEntity);
}

