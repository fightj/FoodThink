package com.ssafy.foodthink.recipes.entity;

import com.ssafy.foodthink.user.entity.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Entity
@Getter
@Setter
@Table(name = "recipe")
public class RecipeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long recipeId;
    //자동생성 기본키

    private String recipeTitle;         //레시피 제목
    private String cateType;            //종류별 분류 -> 새로 구성
    private String cateMainIngre;       //재료별 분류
    private String serving;             //인분
    private Integer level;              //난이도   -> 새로 구성
    private String requiredTime;        //소요시간
    private LocalDateTime writeTime;    //작성시간
    private Integer hits;               //조회수
    private String recipeUrl;           //레시피 URL
    private String image;               //대표이미지 URL
    private Boolean isPublic;           //공개여부

    @ManyToOne(cascade = CascadeType.ALL)   //부모 객체 CRUD 때 자식 객체도 동시에 작업 수행
    @JoinColumn(name = "user_id")     //외래키 컬럼 지정 (recipeId로 생성된다.)
    private UserEntity userEntity;      //사용자ID

    //작성시간을 현재로 설정
    @PrePersist
    protected void onCreate() {
        this.writeTime = LocalDateTime.now();

        //hits에 1~300 사이의 랜덤 숫자 값 설정
        Random random = new Random();
        this.hits = random.nextInt(300) + 1;

        if(this.isPublic == null) {
            this.isPublic = true;
        }
    }

//    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<IngredientEntity> ingredients = new ArrayList<>();
//    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<ProcessEntity> processes = new ArrayList<>();

}
