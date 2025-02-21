package com.ssafy.foodthink.recipes.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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

    @OneToMany(mappedBy = "processEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProcessImageEntity> processImages = new ArrayList<>();

    public ProcessEntity(Integer processOrder, String processExplain, RecipeEntity recipeEntity) {
        this.processOrder = processOrder;
        this.processExplain = processExplain;
        this.recipeEntity = recipeEntity;
    }
}