package com.ssafy.foodthink.recipeBookmark.entity;

import com.ssafy.foodthink.recipes.entity.RecipeEntity;
import com.ssafy.foodthink.user.entity.UserEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name="RecipeBookmark")
public class RecipeBookmarkEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="mark_id")
    private Long markId;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "recipe_id")
    private RecipeEntity recipeId;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id")
    private UserEntity userId;

    @CreatedDate // 엔티티가 생성될 때의 시간을 자동 저장
    @Column(name="write_time")
    private LocalDateTime writeTime;

}
