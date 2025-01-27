package com.ssafy.foodthink.feed.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class FeedRequestDto {
    private String foodName;
    private String content;
    private Long userId;
    private Long userRecipeId;
    private Long crawlingRecipeId;

    public String getFoodName() {
        return foodName;
    }

    public String getContent() {
        return content;
    }

    public Long getUserId() {
        return userId;
    }

    public Long getUserRecipeId() {
        return userRecipeId;
    }

    public Long getCrawlingRecipeId() {
        return crawlingRecipeId;
    }
}
