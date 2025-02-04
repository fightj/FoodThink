package com.ssafy.foodthink.feed.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class FeedInRecipeResponseDto {
    private Long recipeId;      //레시피 아이디
    private Long feedId;            //피드 아이디
    private String firstImage;       //피드 첫번째 이미지
    private String nickname;    //사용자 닉네임
    private String userImage;   //사용자 이미지
}
