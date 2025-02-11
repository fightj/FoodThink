package com.ssafy.foodthink.user.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@Table(name = "users")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
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
}


