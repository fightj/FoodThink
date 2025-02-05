package com.ssafy.foodthink.user.repository;

import com.ssafy.foodthink.user.entity.RecipeViewHistoryEntity;
import com.ssafy.foodthink.user.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Pageable;
import java.util.List;

@Repository
public interface RecipeViewRepository extends JpaRepository<RecipeViewHistoryEntity, Long> {

    List<RecipeViewHistoryEntity> findByUserEntity(UserEntity user, Pageable pageable);
}

