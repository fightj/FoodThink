package com.ssafy.foodthink.webCrawling.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "crawling_process_image_entity")
public class CrawlingProcessImageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long imageId;     //기본키

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "process_id")
    private CrawlingProcessEntity crawlingProcess;    //과정ID 외래키

    private String imageUrl;    //사진URL

}