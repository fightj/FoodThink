package com.ssafy.foodthink.subscribe.controller;

import com.ssafy.foodthink.subscribe.service.SubscribeService;
import com.ssafy.foodthink.user.jwt.JWTUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/api/subscribe")
public class SubscribeController {
    private final SubscribeService subscribeService;
    private final JWTUtil jwtUtil;


    public SubscribeController(SubscribeService subscribeService, JWTUtil jwtUtil) {
        this.subscribeService = subscribeService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/create/{nickname}")
    public ResponseEntity<?> createSubscribe(@RequestHeader("Authorization") String token,
                                             @PathVariable String nickname
                                             ){
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);

        subscribeService.createSubscribe(userId, nickname);

        return ResponseEntity.ok("정상적으로 구독이 완료되었습니다.");
    }

    @DeleteMapping("/delete/{nickname}")
    public ResponseEntity<?> deleteSubscribe(@RequestHeader("Authorization") String token,
                                             @PathVariable String nickname){
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);

        subscribeService.deleteSubscribe(userId, nickname);

        return ResponseEntity.ok("정상적으로 구독이 취소되었습니다.");
    }

    @GetMapping("/read")
    public ResponseEntity<?> readSubscribeUsers(@RequestHeader("Authorization") String token
                                                ){
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);

        subscribeService.readSubscribe(userId);

        return ResponseEntity.ok(subscribeService.readSubscribe(userId));
    }

    @GetMapping("/read/check/{nickname}")
    public ResponseEntity<Map<String, Object>> checkSubscribe(@RequestHeader("Authorization") String token,
                                             @PathVariable String nickname
    ) {
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);

        boolean check = subscribeService.checkSubscribe(userId, nickname);

        Map<String, Object> response = new HashMap<>();
        response.put("check", check);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/read/count/{nickname}")
    public ResponseEntity<Map<String, Object>> countSubscribe(@PathVariable String nickname){
        int count = subscribeService.countSubscribedUser(nickname);

        Map<String, Object> response = new HashMap<>();
        response.put("count", count);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/read/recipes")
    public ResponseEntity<?> readRecipesBySubscribe(){
        subscribeService.readRecipesBySubscribe(21L);
        return ResponseEntity.ok("");
    }
}
