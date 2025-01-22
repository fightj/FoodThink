package com.ssafy.foodthink.sociaLogin.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name="user")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userId;

    @Column(name="social_id")
    private String socialId;

    @Column(name = "social_type")
    private String socialType;

    private String email;

    private String nickname;

    private String image;

    @Column(name="refresh_token")
    private String refreshToken;

//    @Builder
//    public UserEntity(String socialId, String socialType, String email) {
//        this.socialId = socialId;
//        this.socialType = socialType;
//        this.email = email;
//    }
//
//    public void updateRefreshToken(String refreshToken) {
//        this.refreshToken = refreshToken;
//    }
//
//    public void updateProfile(String nickname, String image) {
//        this.nickname = nickname;
//        this.image = image;
//    }

}
