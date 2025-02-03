package com.ssafy.foodthink.feed.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class FeedSummaryResponseDto {
    private Long id;
    private String image;
    private String userNickname;
    private String userImage;
    private int imageSize;
}
