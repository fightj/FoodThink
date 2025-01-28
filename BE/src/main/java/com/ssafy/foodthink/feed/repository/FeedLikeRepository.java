package com.ssafy.foodthink.feed.repository;

import com.ssafy.foodthink.feed.entity.FeedLikeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedLikeRepository extends JpaRepository<FeedLikeEntity, Long> {
    boolean existsByFeedEntity_IdAndUsersEntity_userId(Long feedId, Long userId);
    FeedLikeEntity findByFeedEntity_IdAndUsersEntity_userId(Long feedId, Long userID);
}
