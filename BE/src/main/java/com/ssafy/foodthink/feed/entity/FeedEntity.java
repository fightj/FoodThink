package com.ssafy.foodthink.feed.entity;

import com.ssafy.foodthink.another.CrawlingRecipe;
import com.ssafy.foodthink.another.UserRecipe;
import com.ssafy.foodthink.another.UsersEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

@Data
@Table(name="Feed")
@Entity
@Builder
public class FeedEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "feed_id")
    private Long id;

    @Column(nullable = false, name = "food_name")
    private String foodName;

    @Column(nullable = false)
    private String content;

    @Column(name = "write_time")
    @CreatedDate
    private LocalDateTime writeTime = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UsersEntity usersEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_recipe_id", nullable = true, referencedColumnName = "recipe_id")
    private UserRecipe userRecipe;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "crawling_recipe_id", nullable = true, referencedColumnName = "recipe_id")
    private CrawlingRecipe crawlingRecipe;

}