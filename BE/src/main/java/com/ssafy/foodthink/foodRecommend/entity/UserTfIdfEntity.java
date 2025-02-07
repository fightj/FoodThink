package com.ssafy.foodthink.foodRecommend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name="user_tfidf")
public class UserTfIdfEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_tfidf_id")
    private Long userTfidfId;

    @Column(name="user_id")
    private Long userId;

    @Column(name = "feature", nullable = false)
    private String feature;

    @Column(name = "tfidf_value", nullable = false)
    private Double tfIdfValue;
}
