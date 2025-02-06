package com.ssafy.foodthink.user.controller;

import com.ssafy.foodthink.user.dto.RecipeViewDto;
import com.ssafy.foodthink.user.dto.UserDto;
import com.ssafy.foodthink.user.dto.UserInfoDto;
import com.ssafy.foodthink.user.dto.UserInterestDto;
import com.ssafy.foodthink.user.jwt.JWTUtil;
import com.ssafy.foodthink.user.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final JWTUtil jwtUtil;

    @Autowired
    public UserController(UserService userService, JWTUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }
    
    // 회원 정보 조회
    @GetMapping("/read")
    public ResponseEntity<UserInfoDto> readCurrentUser(@RequestHeader("Authorization") String token) {
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);
        UserInfoDto userInfoDto = userService.readUserByUserId(userId);
        return ResponseEntity.ok(userInfoDto);
    }

    // 회원 닉네임 수정
    @PutMapping("/update/nickname")
    public ResponseEntity<UserInfoDto> updateUserNickname(@RequestHeader("Authorization") String token, @RequestBody UserInfoDto updatedInfo) {
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);

        UserInfoDto updatedUser = userService.updateUserNickname(userId, updatedInfo.getNickname());
        return ResponseEntity.ok(updatedUser);
    }

    // 회원 프로필 사진 수정
    @PutMapping("/update/image")
    public ResponseEntity<UserInfoDto> updateUserImage(@RequestHeader("Authorization") String token, @RequestPart("image") MultipartFile image) {
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);

        UserInfoDto updatedUser = userService.updateUserImage(userId, image);

        return ResponseEntity.ok(updatedUser);
    }

    // 회원 탈퇴
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteUser(@RequestHeader("Authorization") String token) {
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);

        userService.deleteUser(userId);

        return ResponseEntity.status(HttpStatus.OK).body("사용자가 성공적으로 탈퇴되었습니다.");
    }

    // 회원 관심사 조회
    @GetMapping("/read/interest")
    public ResponseEntity<List<UserInterestDto>> readUserInterest(@RequestHeader("Authorization") String token) {
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);
        List<UserInterestDto> interests = userService.readUserInterest(userId);
        return ResponseEntity.ok(interests);
    }

    // 회원 관심사 여러개 추가
    @PostMapping("/create/interest")
    public ResponseEntity<List<UserInterestDto>> createUserInterests(@RequestHeader("Authorization") String token, @RequestBody List<UserInterestDto> interestDtos) {
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);
        List<UserInterestDto> newInterests = userService.createUserInterests(userId, interestDtos);
        return ResponseEntity.status(HttpStatus.CREATED).body(newInterests);
    }

    // 회원 관심사 삭제
    @DeleteMapping("/delete/interest/{interestId}")
    public ResponseEntity<String> deleteUserInterest(@RequestHeader("Authorization") String token, @PathVariable Long interestId) {
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);
        userService.deleteUserInterest(userId, interestId);
        return ResponseEntity.ok("관심사가 성공적으로 삭제되었습니다.");
    }


    // 사용자의 레시피 조회 기록 저장
    @PostMapping("/create/recipe/view/{recipeId}")
    public ResponseEntity<String> createRecipeView(@RequestHeader("Authorization") String token, @PathVariable Long recipeId){
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);
        userService.createRecipeView(userId, recipeId);
        return ResponseEntity.ok("레시피 조회 기록이 저장되었습니다.");
    }

    // 사용자의 최근 본 레시피 10개 조회
    @GetMapping("/read/recipe/view")
    public ResponseEntity<List<RecipeViewDto>> readRecentRecipeViews(@RequestHeader("Authorization") String token, @RequestParam(defaultValue = "10") int count) {
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);

        List<RecipeViewDto> recentViews = userService.readRecentRecipeViews(userId, count);
        return ResponseEntity.ok(recentViews);
    }





}
