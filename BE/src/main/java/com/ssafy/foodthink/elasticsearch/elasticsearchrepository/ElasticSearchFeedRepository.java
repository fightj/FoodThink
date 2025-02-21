package com.ssafy.foodthink.elasticsearch.elasticsearchrepository;

import com.ssafy.foodthink.elasticsearch.entity.FeedElasticEntity;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;

public interface ElasticSearchFeedRepository extends ElasticsearchRepository<FeedElasticEntity, String> {
    @Override
    List<FeedElasticEntity> findAll();
    List<FeedElasticEntity> findByNicknameContainingIgnoreCaseOrFoodNameContainingIgnoreCase(String nickname, String foodName);

}
