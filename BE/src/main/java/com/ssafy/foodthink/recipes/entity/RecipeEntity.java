package com.ssafy.foodthink.recipes.entity;

import com.ssafy.foodthink.user.entity.UserEntity;
import com.ssafy.foodthink.user.repository.UserRepository;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Entity
@Getter
@Setter
@Table(name = "recipe", indexes = {
        @Index(name = "idx_recipe_hits", columnList = "hits DESC"),
        @Index(name = "idx_recipe_hits_writeTime", columnList = "hits DESC, writeTime DESC")
})
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
    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean isPublic = true;           //공개여부

    @ManyToOne(fetch = FetchType.LAZY)
//    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id")     //외래키 컬럼 지정 (recipeId로 생성된다.)
    private UserEntity userEntity;      //사용자ID

    @Transient  //JPA 관리 대상에서 제외
    @Autowired
    private transient UserRepository userRepository;

    @PrePersist
    protected void onCreate() {
        //작성 시간을 현재로 설정
        this.writeTime = LocalDateTime.now();
        Random random = new Random();
        //hits에 1~300 사이 랜덤 숫자값 설정
        this.hits = random.nextInt(300) + 1;
    }

    @OneToMany(mappedBy = "recipeEntity", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<IngredientEntity> ingredients = new ArrayList<>();
    @OneToMany(mappedBy = "recipeEntity", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<ProcessEntity> processes = new ArrayList<>();

}
