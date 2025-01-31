package com.ssafy.foodthink.recipes.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "user_recipe_ingredient")
public class UserRecipeeIngredientEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ingreId;      //자동생성 기본키

    private String ingreName;               //재료명
    private String amount;                  //수량+단위

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "recipe_id")
    private UserRecipeEntity userRecipe;    //레시피ID 외래키

}