package com.ssafy.foodthink.webCrawling.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "process_image")
public class ProcessImageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long imageId;     //기본키

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "process_id")
    private ProcessEntity processEntity;    //과정ID 외래키

    private String imageUrl;    //사진URL

}