package com.ssafy.foodthink.recipes.entity;

import com.ssafy.foodthink.user.entity.UserEntity;
import com.ssafy.foodthink.webCrawling.entity.RecipeEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "crawling_mark")
public class CrawlingMarkEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long markId;      //자동생성 기본키

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "recipe_id")
    private RecipeEntity crawlingRecipe;

    private LocalDateTime writeTime;    //작성시간

}