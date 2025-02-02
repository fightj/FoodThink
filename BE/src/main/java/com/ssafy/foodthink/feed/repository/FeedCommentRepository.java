package com.ssafy.foodthink.feed.repository;

import com.ssafy.foodthink.feed.entity.FeedCommentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedCommentRepository extends JpaRepository<FeedCommentEntity, Long> {
}
