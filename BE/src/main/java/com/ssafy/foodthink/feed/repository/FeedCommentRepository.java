package com.ssafy.foodthink.feed.repository;

import com.ssafy.foodthink.feed.entity.FeedCommentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeedCommentRepository extends JpaRepository<FeedCommentEntity, Long> {
    List<FeedCommentEntity> findAllByFeedEntity_IdOrderByFeedEntity_writeTime(Long feedId);
}
