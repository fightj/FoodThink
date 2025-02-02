package com.ssafy.foodthink.feed.service;

import com.ssafy.foodthink.feed.dto.*;
import com.ssafy.foodthink.feed.entity.FeedEntity;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.AccessDeniedException;
import java.util.List;

public interface FeedService {
    void createFeed(FeedRequestDto feedRequestDto, List<MultipartFile> images);  //피드 생성
    FeedResponseDto readFeedById(Long id);//피드 Id를 통한 상세 조회
    FeedResponseDto readFeedById(Long id, Long userId);
    List<FeedResponseDto> readFeedsByUserId(Long userId);   //유저별 피드 전체 상세 조회
    List<FeedResponseDto> readFeedsByUserId(Long searchUserId, Long logInUserId);   //로그인한 유저일 경우 좋아요했는지 확인가능
    void deleteFeed(Long feedId, Long userId);   //피드 삭제
    void updateFeed(Long feedId, Long userId, FeedRequestDto feedRequestDto, List<MultipartFile> images);  //피드 수정
    CustomPageResponseDto<FeedSummaryResponseDto> readFeedsOrderByWriteTime(int page, int size);
    void createFeedLikeByFeedId(Long feedId, Long userId);  //피드 좋아요 추가
    void deleteFeedLikeByFeedId(Long feedId, Long userId);  //피드 좋아요 삭제
    void createFeedCommentByFeedId(Long feedId, FeedCommentRequestDto feedCommentRequestDto);  //피드 댓글 추가
    void deleteFeedCommentByFeedCommentId(Long feedCommentId); //피드 댓글 삭제
    void updateFeedCommentByFeedCommentId(Long feedCommentId, FeedCommentRequestDto feedCommentRequestDto);  //피드 댓글 수정 기능
    List<FeedCommentResponseDto> readFeedCommentsByFeedId(Long feedId);  //피드별 댓글 조회

    //범용적 사용 메소드용
    List<String> readImageUrlsByFeedId(Long id);   //피드별 이미지 조회
    FeedResponseDto createFeedResponseDtoByBuilder(FeedEntity feedEntity, List<String> imageUrls);
}
