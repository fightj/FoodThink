package com.ssafy.foodthink.feed.repository;

import com.ssafy.foodthink.feed.entity.FeedEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FeedRepository extends JpaRepository<FeedEntity, Long> {
    List<FeedEntity> findAllByUsersEntity_userIdOrderByWriteTime(Long id);
}

