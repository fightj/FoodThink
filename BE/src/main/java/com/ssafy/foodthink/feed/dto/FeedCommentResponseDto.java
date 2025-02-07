package com.ssafy.foodthink.feed.dto;

import com.ssafy.foodthink.feed.entity.FeedCommentEntity;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class FeedCommentResponseDto {
    private Long id;
    private Long userId;
    private String content;
    private String username;
    private String userImage;
    private LocalDateTime writeTime;

    public static FeedCommentResponseDto fromEntity(FeedCommentEntity feedCommentEntity){
        return FeedCommentResponseDto.builder()
                .id(feedCommentEntity.getId())
                .userId(feedCommentEntity.getUserEntity().getUserId())
                .content(feedCommentEntity.getContent())
                .username(feedCommentEntity.getUserEntity().getNickname())
                .userImage(feedCommentEntity.getUserEntity().getImage())
                .writeTime(feedCommentEntity.getWriteTime())
                .build();
    }
}
