package com.ssafy.foodthink.user.controller;

import com.ssafy.foodthink.user.dto.UserDto;
import com.ssafy.foodthink.user.dto.UserInfoDto;
import com.ssafy.foodthink.user.jwt.JWTUtil;
import com.ssafy.foodthink.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/users")
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
    public ResponseEntity<UserInfoDto> getCurrentUser(@RequestHeader("Authorization") String token) {
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);
        UserInfoDto userInfoDto = userService.getUserById(userId);
        return ResponseEntity.ok(userInfoDto);
    }

    // 회원 닉네임 수정
    @PutMapping("/update/nickname")
    public ResponseEntity<UserInfoDto> updateUserNickname(@RequestHeader("Authorization") String token,
                                                      @RequestBody UserInfoDto updatedInfo) {
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
}
