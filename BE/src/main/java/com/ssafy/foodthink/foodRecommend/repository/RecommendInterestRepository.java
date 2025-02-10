package com.ssafy.foodthink.foodRecommend.repository;

import com.ssafy.foodthink.user.entity.UserEntity;
import com.ssafy.foodthink.user.entity.UserInterestEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecommendInterestRepository extends JpaRepository<UserInterestEntity, Long> {
    List<UserInterestEntity> findByUserIdAndIsLiked(UserEntity userId, Boolean isLiked);
}
