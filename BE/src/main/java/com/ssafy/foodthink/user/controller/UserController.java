package com.ssafy.foodthink.user.controller;

import com.ssafy.foodthink.user.dto.UserDto;
import com.ssafy.foodthink.user.dto.UserInfoDto;
import com.ssafy.foodthink.user.jwt.JWTUtil;
import com.ssafy.foodthink.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    
    // 사용자 정보 조회
    @GetMapping("/read")
    public ResponseEntity<UserInfoDto> getCurrentUser(@RequestHeader("Authorization") String token) {
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);
        UserInfoDto userInfoDto = userService.getUserById(userId);
        return ResponseEntity.ok(userInfoDto);
    }

    // 사용자 정보 수정(nickname, image)
    @PutMapping("/update")
    public ResponseEntity<UserInfoDto> updateUserInfo(@RequestHeader("Authorization") String token,
                                                      @RequestBody UserInfoDto updatedInfo) {
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);

        UserInfoDto updatedUser = userService.updateUserInfo(userId, updatedInfo.getNickname(), updatedInfo.getImage());
        return ResponseEntity.ok(updatedUser);
    }

    // 사용자 탈퇴
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteUser(@RequestHeader("Authorization") String token) {
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);

        userService.deleteUser(userId);

        return ResponseEntity.status(HttpStatus.OK).body("사용자가 성공적으로 탈퇴되었습니다.");
    }
}
