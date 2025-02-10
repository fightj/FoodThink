package com.ssafy.foodthink.user.controller;

import com.ssafy.foodthink.user.dto.RecipeViewDto;
import com.ssafy.foodthink.user.dto.UserDto;
import com.ssafy.foodthink.user.dto.UserInfoDto;
import com.ssafy.foodthink.user.dto.UserInterestDto;
import com.ssafy.foodthink.user.entity.UserEntity;
import com.ssafy.foodthink.user.jwt.JWTUtil;
import com.ssafy.foodthink.user.repository.RecipeViewRepository;
import com.ssafy.foodthink.user.repository.UserRepository;
import com.ssafy.foodthink.user.service.UserService;
import lombok.RequiredArgsConstructor;
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
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final JWTUtil jwtUtil;
    private final RecipeViewRepository recipeViewRepository;
    private final UserRepository userRepository;

    
    // 회원 정보 조회(닉네임)
    @GetMapping("/read/another-info/{nickname}")
    public ResponseEntity<UserInfoDto> readAnotherUser(@PathVariable String nickname) {
        UserInfoDto userInfoDto = userService.readUserByUserNickname(nickname);
        return ResponseEntity.ok(userInfoDto);
    }

    // 회원 정보 조회(토큰)
    @GetMapping("/read/my-info")
    public ResponseEntity<UserInfoDto> readCurrentUser(@RequestHeader("Authorization") String token) {
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);
        UserInfoDto userInfoDto = userService.readUserByUserId(userId);
        return ResponseEntity.ok(userInfoDto);
    }


    // 회원 닉네임 수정
    @PreAuthorize("hasRole('ROLE_USER')")
    @PutMapping("/update/nickname")
    public ResponseEntity<UserInfoDto> updateUserNickname(@RequestHeader("Authorization") String token, @RequestBody UserInfoDto updatedInfo) {
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);

        UserInfoDto updatedUser = userService.updateUserNickname(userId, updatedInfo.getNickname());
        return ResponseEntity.ok(updatedUser);
    }

    // 회원 프로필 사진 수정
    @PreAuthorize("hasRole('ROLE_USER')")
    @PutMapping("/update/image")
    public ResponseEntity<UserInfoDto> updateUserImage(@RequestHeader("Authorization") String token, @RequestPart("image") MultipartFile image) {
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);

        UserInfoDto updatedUser = userService.updateUserImage(userId, image);

        return ResponseEntity.ok(updatedUser);
    }

    // 회원 탈퇴
    @PreAuthorize("hasRole('ROLE_USER')")
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteUser(@RequestHeader("Authorization") String token) {
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);

        userService.deleteUser(userId);

        return ResponseEntity.status(HttpStatus.OK).body("사용자가 성공적으로 탈퇴되었습니다.");
    }

    // 회원 관심사 조회
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/read/interest")
    public ResponseEntity<List<UserInterestDto>> readUserInterest(@RequestHeader("Authorization") String token) {
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);
        List<UserInterestDto> interests = userService.readUserInterest(userId);
        return ResponseEntity.ok(interests);
    }


    // 회원 관심사 수정
    @PreAuthorize("hasRole('ROLE_USER')")
    @PostMapping("/update/interest")
    public ResponseEntity<List<UserInterestDto>> updateUserInterests(@RequestHeader("Authorization") String token, @RequestBody List<UserInterestDto> interestDtos){
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);
        List<UserInterestDto> newInterests = userService.updateUserInterests(userId, interestDtos);

        return ResponseEntity.status(HttpStatus.CREATED).body(newInterests);
    }


    // 사용자의 레시피 조회 기록 저장
    @PreAuthorize("hasRole('ROLE_USER')")
    @PostMapping("/create/recipe/view/{recipeId}")
    public ResponseEntity<String> createRecipeView(@RequestHeader("Authorization") String token, @PathVariable Long recipeId){
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);
        userService.createRecipeView(userId, recipeId);
        return ResponseEntity.ok("레시피 조회 기록이 저장되었습니다.");
    }

    // 사용자의 최근 본 레시피 10개 조회
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/read/recipe/view")
    public ResponseEntity<List<RecipeViewDto>> readRecentRecipeViews(@RequestHeader("Authorization") String token, @RequestParam(defaultValue = "10") int count) {
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);

        List<RecipeViewDto> recentViews = userService.readRecentRecipeViews(userId, count);
        return ResponseEntity.ok(recentViews);
    }





}
