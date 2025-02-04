package com.ssafy.foodthink.myOwnRecipe.controller;

import com.ssafy.foodthink.myOwnRecipe.dto.MyRecipeWriteRequestDto;
import com.ssafy.foodthink.myOwnRecipe.service.MyOwnRecipeService;
import com.ssafy.foodthink.user.jwt.JWTUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Controller
@RequestMapping("/myOwnRecipe")
@RequiredArgsConstructor
public class MyOwnRecipeController {

    private final MyOwnRecipeService myOwnRecipeService;
    private final JWTUtil jwtUtil;

    //레시피 저장
    @PostMapping("/create")
    public ResponseEntity<?> createRecipe(@RequestHeader("Authorization") String token,
                                          @RequestPart("recipe") MyRecipeWriteRequestDto dto,
                                          @RequestPart("imageFile") MultipartFile imageFile, // 대표 이미지
                                          @RequestPart("processImage") List<MultipartFile> processImages) {
        try {
            // JWT에서 userId 호출
            String accessToken = token.replace("Bearer ", "");
            Long userId = jwtUtil.getUserId(accessToken);

            dto.setUserId(userId);

            // 서비스 호출
            myOwnRecipeService.createRecipe(dto, imageFile, processImages);

            return ResponseEntity.ok("레시피가 저장되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("레시피 저장에 실패했습니다.");
        }
    }
}
