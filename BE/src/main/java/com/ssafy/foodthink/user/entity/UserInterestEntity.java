package com.ssafy.foodthink.user.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "IngreInterest")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserInterestEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ingre_interest_id")
    private Long ingreInterestId;

    @Column(name = "ingredient")
    private String ingredient;

    @Column(name = "is_liked")
    private Boolean isLiked; // 선호 true, 기피 false

    @ManyToOne
    @JoinColumn(name = "user_id")
    @OnDelete(action = OnDeleteAction.CASCADE) // 부모 엔티티가 삭제될 때 연관된 자식 엔티티도 함께 삭제
    private UserEntity userId;

    //==생성 메서드==//
    public static UserInterestEntity createInterest(String ingredient, Boolean isLiked, UserEntity userId) {
        UserInterestEntity userInterestEntity = new UserInterestEntity();
        userInterestEntity.setIngredient(ingredient);
        userInterestEntity.setIsLiked(isLiked);
        userInterestEntity.setUserId(userId);
        return userInterestEntity;
    }
}
