package com.ssafy.foodthink.recipes.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RecipeListTop20ResponseDto {
    private Long recipeId;
    private String recipeTitle;
    private String image;
    private String nickname;
    private String userImage;
    private Integer hits;
    private Long bookMarkCount;
//    private boolean isBookMarked;   //북마크 상태 여부

    public void RecipeListRequestDto(Long recipeId, String recipeTitle, String image,
                                     String nickname, String userImage, Integer hits,
                                     Long bookMarkCount) {
        this.recipeId = recipeId;
        this.recipeTitle = recipeTitle;
        this.image = image;
        this.nickname = nickname;
        this.userImage = userImage;
        this.hits = hits;
        this.bookMarkCount = bookMarkCount;
//        this.isBookMarked = isBookMarked;
    }
}
