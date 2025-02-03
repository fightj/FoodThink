package com.ssafy.foodthink.recipes.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

/*
    모든 레시피 목록 조회
    프론트로 보낼 출력값
 */

@Getter
@Setter
@AllArgsConstructor
public class RecipeListResponseDto {
    private Long recipeId;
    private String recipeTitle;
    private String image;
    private String nickname;
    private String userImage;
    private Integer hits;
    private Long bookMarkCount;
    private boolean isBookMarked;   //북마크 상태 여부

    public void RecipeListRequestDto(Long recipeId, String recipeTitle, String image,
                                     String nickname, String userImage, Integer hits,
                                     Long bookMarkCount, boolean isBookMarked) {
        this.recipeId = recipeId;
        this.recipeTitle = recipeTitle;
        this.image = image;
        this.nickname = nickname;
        this.userImage = userImage;
        this.hits = hits;
        this.bookMarkCount = bookMarkCount;
        this.isBookMarked = isBookMarked;
    }
}
