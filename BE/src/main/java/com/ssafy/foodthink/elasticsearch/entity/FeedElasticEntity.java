package com.ssafy.foodthink.elasticsearch.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.annotation.Id;

@Document(indexName = "feed1")
@Getter
@Setter
public class FeedElasticEntity {
    @Id
    private Long feedId;
    private String nickname;
    private String foodName;
}
