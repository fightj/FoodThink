package com.ssafy.foodthink.feed.service;

import com.ssafy.foodthink.feed.dto.FeedRequestDto;
import com.ssafy.foodthink.feed.dto.FeedResponseDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FeedService {
    void createFeed(FeedRequestDto feedRequestDto, List<MultipartFile> images);
    FeedResponseDto readFeedById(Long id);

}
