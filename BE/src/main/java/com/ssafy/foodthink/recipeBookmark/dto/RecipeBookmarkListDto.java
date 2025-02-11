package com.ssafy.foodthink.recipeBookmark.dto;

import lombok.*;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
public class RecipeBookmarkListDto {

    private Long recipeId;
    private String recipeTitle;
    private String image;
    private String nickname;
    private String userImage;
}
