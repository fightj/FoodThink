package com.ssafy.foodthink.recipes.entity;

import com.ssafy.foodthink.user.entity.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "recipe_book_mark")
public class RecipeBookMark {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long markId;

    private LocalDateTime writeTime;    //작성시간

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "recipe_id")
    private RecipeEntity recipeEntity;  //레시피 테이블의 레시피ID
    
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id")
    private UserEntity userEntity;      //사용자 테이블의 사용자ID
    
    @PrePersist
    protected void onCreate() {
        //작성 시간을 현재로 설정
        this.writeTime = LocalDateTime.now();
    }
}
