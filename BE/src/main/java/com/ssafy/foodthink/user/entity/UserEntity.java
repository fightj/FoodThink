package com.ssafy.foodthink.user.entity;

import com.ssafy.foodthink.feed.entity.FeedCommentEntity;
import com.ssafy.foodthink.feed.entity.FeedEntity;
import com.ssafy.foodthink.feed.entity.FeedImageEntity;
import com.ssafy.foodthink.feed.entity.FeedLikeEntity;
import com.ssafy.foodthink.foodRecommend.entity.UserTfIdfEntity;
import com.ssafy.foodthink.recipeBookmark.entity.RecipeBookmarkEntity;
import com.ssafy.foodthink.recipes.entity.RecipeEntity;
import com.ssafy.foodthink.subscribe.entity.SubscribeEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "users")
//@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "social_id")
    private String socialId;

    @Column(name = "social_type")
    private String socialType;

    @Column(unique = true)
    private String email;

    private String nickname;

    private String image;

    @Column(nullable = false)
    private String role;

    @Column(name = "refresh_token")
    private String refreshToken;

    private String season;

    // 생성 메서드
    public static UserEntity createUser(String socialId, String email, String nickname) {
        UserEntity userEntity = new UserEntity();
        userEntity.setSocialId(socialId);
        userEntity.setSocialType("KAKAO");
        userEntity.setEmail(email);
        userEntity.setNickname(nickname);
        userEntity.setImage(null);
        userEntity.setRole("ROLE_USER");
        userEntity.setRefreshToken(null);
        userEntity.setSeason("봄");
        return userEntity;
    }

    @OneToMany(mappedBy = "userEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RecipeBookmarkEntity> bookmarks = new ArrayList<>();

    @OneToMany(mappedBy = "userEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RecipeEntity> recipes = new ArrayList<>();

    @OneToMany(mappedBy = "userEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RecipeViewHistoryEntity> views = new ArrayList<>();

    @OneToMany(mappedBy = "userEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FeedCommentEntity> comments = new ArrayList<>();

    @OneToMany(mappedBy = "userEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FeedEntity> feeds = new ArrayList<>();

    @OneToMany(mappedBy = "userEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FeedLikeEntity> likes = new ArrayList<>();

    @OneToMany(mappedBy = "userId", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserInterestEntity> interests = new ArrayList<>();

    @OneToMany(mappedBy = "subscriber", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SubscribeEntity> subscribers = new ArrayList<>();

    @OneToMany(mappedBy = "subscribedUser", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SubscribeEntity> subscribedUsers = new ArrayList<>();

    @OneToMany(mappedBy = "id.userId", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserTfIdfEntity> tfIdfs = new ArrayList<>();
}


