package com.ssafy.foodthink.feed.entity;

import com.ssafy.foodthink.another.CrawlingRecipe;
import com.ssafy.foodthink.another.UserRecipe;
import com.ssafy.foodthink.another.UsersEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@EntityListeners(AuditingEntityListener.class)
@Data
@Table(name="Feed")
@NoArgsConstructor    //jpa사용하는 경우 기본 생성자 필요
@AllArgsConstructor   //builer와 noargsconstructor 같이 사용하려면 allargsconstructor도 사용해야함
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
    private LocalDateTime writeTime;

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