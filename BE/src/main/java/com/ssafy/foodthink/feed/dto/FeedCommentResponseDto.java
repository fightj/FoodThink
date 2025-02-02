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
    private String content;
    private String username;
    private LocalDateTime writeTime;

    public static FeedCommentResponseDto fromEntity(FeedCommentEntity feedCommentEntity){
        return FeedCommentResponseDto.builder()
                .id(feedCommentEntity.getId())
                .content(feedCommentEntity.getContent())
                .username(feedCommentEntity.getUsersEntity().getUsername())
                .writeTime(feedCommentEntity.getWriteTime())
                .build();
    }
}
