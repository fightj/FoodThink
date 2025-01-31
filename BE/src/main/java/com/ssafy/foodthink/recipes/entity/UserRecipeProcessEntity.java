package com.ssafy.foodthink.recipes.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "user_recipe_process")
public class UserRecipeProcessEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long processId;      //자동생성 기본키

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "recipe_id")
    private UserRecipeEntity userRecipe;    //레시피ID 외래키

    private Integer processOrder;           //과정 순서

    @Lob
    private String processExplain;          //과정 설명

}