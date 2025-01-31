package com.ssafy.foodthink.recipes.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "user_recipe_process_image")
public class UserRecipeProcessImageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long imageId;      //자동생성 기본키

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "process_id")
    private UserRecipeProcessEntity userRecipeProcess;  //과정ID 외래키

    private String imageUrl;    //사진URL

    @Lob
    private String processExplain;          //과정 설명

}