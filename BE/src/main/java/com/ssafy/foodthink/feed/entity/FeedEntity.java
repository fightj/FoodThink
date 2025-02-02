package com.ssafy.foodthink.feed.entity;

import com.ssafy.foodthink.recipes.entity.RecipeEntity;
import com.ssafy.foodthink.user.entity.UserEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity userEntity;

    @ManyToOne
    @JoinColumn(name = "recipeId", nullable = true, referencedColumnName = "recipeId")
    private RecipeEntity recipeEntity;

    //cascade 설정을 위해 좋아요 엔티티와의 관계 설정
    @OneToMany(mappedBy = "feedEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FeedLikeEntity> likes = new ArrayList<>();

    @OneToMany(mappedBy = "feedEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FeedImageEntity> images = new ArrayList<>();

    @OneToMany(mappedBy = "feedEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FeedCommentEntity> comments = new ArrayList<>();
}