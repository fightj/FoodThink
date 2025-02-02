package com.ssafy.foodthink.feed.service;

import com.ssafy.foodthink.feed.dto.FeedCommentRequestDto;
import com.ssafy.foodthink.feed.dto.FeedRequestDto;
import com.ssafy.foodthink.feed.dto.FeedResponseDto;
import com.ssafy.foodthink.feed.entity.FeedEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FeedService {
    void createFeed(FeedRequestDto feedRequestDto, List<MultipartFile> images);  //피드 생성
    FeedResponseDto readFeedById(Long id);  //피드 Id를 통한 상세 조회
    List<FeedResponseDto> readFeedsByUserId(Long userId);   //유저별 피드 전체 상세 조회
    List<FeedResponseDto> readFeedsByUserIdAndLogIn(Long searchUserId, Long logInUserId);   //로그인한 유저일 경우 좋아요했는지 확인가능
    void deleteFeedByFeedId(Long feedId);
    void createFeedLikeByFeedId(Long feedId, Long userId);  //피드 좋아요 추가
    void deleteFeedLikeByFeedId(Long feedId, Long userId);
    void createFeedCommentByFeedId(Long feedId, FeedCommentRequestDto feedCommentRequestDto);

    //범용적 사용 메소드용
    List<String> readImageUrlsByFeedId(Long id);   //피드별 이미지 조회
    FeedResponseDto createFeedResponseDtoByBuilder(FeedEntity feedEntity, List<String> imageUrls);
}
