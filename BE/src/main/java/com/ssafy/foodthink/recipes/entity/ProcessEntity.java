package com.ssafy.foodthink.recipes.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "process")
public class ProcessEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long processId;     //기본키

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "recipe_id")
    private RecipeEntity recipeEntity;    //레시피ID 외래키

    private Integer processOrder;      //과정순서

    @Lob    //TEXT로 필드 처리
    @Column(columnDefinition="LONGTEXT")
    private String processExplain;     //과정설명
}