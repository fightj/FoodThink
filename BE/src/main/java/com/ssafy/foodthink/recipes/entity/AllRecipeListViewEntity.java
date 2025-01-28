package com.ssafy.foodthink.recipes.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

import java.time.LocalDateTime;

/*
    뷰는 읽기 전용 테이블
    레시피 전체 목록 조회용
 */

@Entity
@Table(name = "all_recipe_list_view")
@Getter
public class AllRecipeListViewEntity {
    @Id
    private String viewId;  //CONCAT으로 생성된 뷰ID 기본키
    
    private Long recipeId;
    private String recipeTitle;
    private String level;
    private LocalDateTime writeTime;
    private Integer hits;
    private String recipeUrl;
    private String image;

    public class AllRecipeListResponseDto {
        private Integer hits;

        public int getHits() {
            return Math.abs(this.hits != null ? this.hits : 0);  // null 방지
        }
    }

}
