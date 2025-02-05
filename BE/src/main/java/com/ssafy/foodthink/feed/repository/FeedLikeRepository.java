package com.ssafy.foodthink.feed.repository;

import com.ssafy.foodthink.feed.entity.FeedLikeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeedLikeRepository extends JpaRepository<FeedLikeEntity, Long> {
    boolean existsByFeedEntity_IdAndUserEntity_userId(Long feedId, Long userId);
    FeedLikeEntity findByFeedEntity_IdAndUserEntity_userId(Long feedId, Long userID);
    List<FeedLikeEntity> findByUserEntity_userId(Long userId);
}
