package com.ssafy.foodthink.feed.repository;

import com.ssafy.foodthink.feed.entity.FeedImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeedImageRepository extends JpaRepository<FeedImageEntity, Long> {
    List<FeedImageEntity> findByFeedEntity_Id(Long id);
}
