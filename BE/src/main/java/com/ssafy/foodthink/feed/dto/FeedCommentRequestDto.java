package com.ssafy.foodthink.feed.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class FeedCommentRequestDto {
    private Long userId;
    private String content;
}
