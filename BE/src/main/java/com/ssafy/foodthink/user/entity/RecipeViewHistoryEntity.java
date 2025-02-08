package com.ssafy.foodthink.user.entity;

import com.ssafy.foodthink.recipes.entity.RecipeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

@Entity
@Table(name = "recipe_view_history")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RecipeViewHistoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity userEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id")
    private RecipeEntity recipeEntity;

    @Column(nullable = false)
    private LocalDateTime viewTime = LocalDateTime.now();

    @Builder
    public RecipeViewHistoryEntity(UserEntity user, RecipeEntity recipe) {
        this.userEntity = user;
        this.recipeEntity = recipe;
    }

}

