package com.ssafy.foodthink.another;

import com.ssafy.foodthink.user.entity.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "user_recipe")
public class UserRecipeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long recipeId;      //자동생성 기본키

    private String recipeTitle;         //레시피 제목
    private String cateType;            //종류별 분류
    private String cateMainIngre;       //재료별 분류
    private String serving;             //인분
    private Integer level;              //난이도
    private String requiredTime;        //소요시간
    private LocalDateTime writeTime;    //작성시간
    private Integer hits = 0;           //조회수
    private String recipeUrl;           //레시피 URL

    //사용자 ID FK
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    private boolean isPublic;           //공개유무 (공개할 때 true)
    private String image;               //대표이미지

}