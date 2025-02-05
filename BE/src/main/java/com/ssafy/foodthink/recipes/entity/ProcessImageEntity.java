package com.ssafy.foodthink.recipes.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "process_image")
public class ProcessImageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long imageId;     //기본키

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "process_id")
    private ProcessEntity processEntity;    //과정ID 외래키

    private String imageUrl;    //사진URL

    public ProcessImageEntity(String imageUrl, ProcessEntity processEntity) {
        this.imageUrl = imageUrl;
        this.processEntity = processEntity;
    }
}