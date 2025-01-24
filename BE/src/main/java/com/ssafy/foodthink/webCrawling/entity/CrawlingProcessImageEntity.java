package com.ssafy.foodthink.webCrawling.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

//@Entity
@Getter
@Setter
public class CrawlingProcessImageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long imageId;     //기본키

    @ManyToOne
    @JoinColumn(name = "process_id")
    private CrawlingProcessEntity processEntity;    //과정ID 외래키

    private String imageUrl;    //사진URL
}