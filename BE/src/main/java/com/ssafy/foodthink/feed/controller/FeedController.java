package com.ssafy.foodthink.feed.controller;

import com.ssafy.foodthink.feed.dto.FeedDto;
import com.ssafy.foodthink.feed.service.FeedService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Controller
@RestController
@RequestMapping("/feed")
//@RequiredArgsConstructor
public class FeedController {
    private final FeedService feedService;

    public FeedController(FeedService feedService) {
        this.feedService = feedService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createFeed(@RequestBody FeedDto feedDto){
        feedService.createFeed(feedDto);
        return ResponseEntity.ok("피드 성공적으로 저장되었습니다.");
    }
}
