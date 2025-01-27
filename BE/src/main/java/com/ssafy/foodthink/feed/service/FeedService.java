package com.ssafy.foodthink.feed.service;

import com.ssafy.foodthink.feed.dto.FeedRequestDto;
import com.ssafy.foodthink.feed.dto.FeedResponseDto;
import com.ssafy.foodthink.feed.entity.FeedEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FeedService {
    void createFeed(FeedRequestDto feedRequestDto, List<MultipartFile> images);  //피드 생성
    FeedResponseDto readFeedById(Long id);  //피드 Id를 통한 상세 조회
    List<FeedResponseDto> readFeedsByUserId(Long userId);


    List<String> readImageUrlsByFeedId(Long id);   //피드별 이미지 조회
    FeedResponseDto createFeedResponseDtoByBuilder(FeedEntity feedEntity, List<String> imageUrls);
}
