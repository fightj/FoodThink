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
    private Long recipeId;
}
