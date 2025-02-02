package com.ssafy.foodthink.feed.controller;

import com.ssafy.foodthink.feed.dto.FeedCommentRequestDto;
import com.ssafy.foodthink.feed.dto.FeedRequestDto;
import com.ssafy.foodthink.feed.entity.FeedCommentEntity;
import com.ssafy.foodthink.feed.service.FeedService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Controller
@RestController
@RequestMapping("/feed")
//@RequiredArgsConstructor
public class FeedController {
    private final FeedService feedService;

    public FeedController(FeedService feedService) {
        this.feedService = feedService;
    }

    //피드 저장
    @PostMapping("/create")
    public ResponseEntity<?> createFeed(@RequestPart FeedRequestDto feedRequestDto, @RequestPart("images") List<MultipartFile> images){
        feedService.createFeed(feedRequestDto, images);
        return ResponseEntity.ok("피드 성공적으로 저장되었습니다.");
    }

    //피드 id로 조회
    @GetMapping("/read/id/{id}")
    public ResponseEntity<?> readFeedById(@PathVariable Long id){
        return ResponseEntity.ok(feedService.readFeedById(id));
    }

    //피드 유저별 조회(최신순)
    @GetMapping("/read/user/{userId}")
    public ResponseEntity<?> readFeedsByUserId(@PathVariable Long userId){
        return ResponseEntity.ok(feedService.readFeedsByUserId(userId));
    }

    //테스트:  로그인 유무 +  피드 유저별 전체 상세 조회
    @GetMapping("/read/user/{searchUserId}/{loginUserId}")
    public ResponseEntity<?> readFeedsByUserIdAndLogIn(@PathVariable Long searchUserId, @PathVariable Long loginUserId) {
        return ResponseEntity.ok(feedService.readFeedsByUserIdAndLogIn(searchUserId, loginUserId));
    }

    @DeleteMapping("/delete/{feedId}")
    public ResponseEntity<?> deleteFeedByFeedId(@PathVariable Long feedId){
        feedService.deleteFeedByFeedId(feedId);
        return ResponseEntity.noContent().build();
    }

    //피드 좋아요 추가 기능
    @PostMapping("/like/create/{feedId}/{userId}")
    public ResponseEntity<?> createFeedLikeByFeedId(@PathVariable Long feedId, @PathVariable Long userId){
        feedService.createFeedLikeByFeedId(feedId, userId);
        return ResponseEntity.ok("피드 성공적으로 저장되었습니다.");
    }

    //피드 좋아요 삭제 기능
    @DeleteMapping("/like/delete/{feedId}/{userId}")
    public ResponseEntity<Void> deleteFeedLike(@PathVariable Long feedId, @PathVariable Long userId){
        feedService.deleteFeedLikeByFeedId(feedId, userId);
        return ResponseEntity.noContent().build();  //성공시 204 응답(요청 성공나타내지만, 추가 정보가 필요하지 않을때 사용)
    }

    //피드 댓글 추가 기능
    @PostMapping("/comment/create/{feedId}/{userId}")
    public ResponseEntity<?> createFeedComment(@PathVariable Long feedId, @PathVariable Long userId, @RequestBody FeedCommentRequestDto feedCommentRequestDto){
        feedCommentRequestDto.setUserId(userId);
        feedService.createFeedCommentByFeedId(feedId, feedCommentRequestDto);
        return ResponseEntity.ok("피드 댓글이 성공적으로 저장되었습니다.");
    }

    //피드 댓글 삭제 기능
    @DeleteMapping("/comment/delete/{feedCommentId}")
    public ResponseEntity<Void> deleteFeedCommentByFeedCommentId(@PathVariable Long feedCommentId){
        feedService.deleteFeedCommentByFeedId(feedCommentId);
        return ResponseEntity.noContent().build();
    }
}
