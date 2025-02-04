package com.ssafy.foodthink.myOwnRecipe.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.foodthink.myOwnRecipe.dto.MyRecipeModifyReadResponseDto;
import com.ssafy.foodthink.myOwnRecipe.dto.MyRecipeWriteRequestDto;
import com.ssafy.foodthink.myOwnRecipe.dto.ProcessImageRequestDto;
import com.ssafy.foodthink.myOwnRecipe.dto.ProcessRequestDto;
import com.ssafy.foodthink.myOwnRecipe.service.MyOwnRecipeService;
import com.ssafy.foodthink.user.jwt.JWTUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/myOwnRecipe")
@RequiredArgsConstructor
public class MyOwnRecipeController {

    private final MyOwnRecipeService myOwnRecipeService;
    private final JWTUtil jwtUtil;

    //레시피 저장
    @PostMapping("/create")
    public ResponseEntity<?> createRecipe(@RequestHeader("Authorization") String token,
                                          @RequestPart("recipe") String recipeJson,
                                          @RequestPart("imageFile") MultipartFile imageFile,
                                          @RequestPart(value="processImages", required = false) List<MultipartFile> processImages,
                                          @RequestPart(value="processOrders", required = false) List<Integer> processOrders) {
        try {
            // JSON을 DTO로 변환
            ObjectMapper objectMapper = new ObjectMapper();
            MyRecipeWriteRequestDto dto = objectMapper.readValue(recipeJson, MyRecipeWriteRequestDto.class);

            // JWT에서 userId 호출
            String accessToken = token.replace("Bearer ", "");
            Long userId = jwtUtil.getUserId(accessToken);
            dto.setUserId(userId);

            // processImages와 processOrders 매핑하기
            if (processImages != null && processOrders != null) {
                if (processImages.size() != processOrders.size()) {
                    throw new IllegalArgumentException("이미지와 과정 순서의 갯수가 일치하지 않습니다.");
                }

                Map<Integer, ProcessImageRequestDto> imageMap = new HashMap<>();
                for(int i=0; i<processOrders.size(); i++) {
                    Integer order = processOrders.get(i);
                    MultipartFile image = processImages.get(i);
                    imageMap.put(order, new ProcessImageRequestDto(order, image));
                }

                for(ProcessRequestDto processDto : dto.getProcesses()) {
                    ProcessImageRequestDto imageDto = imageMap.get(processDto.getProcessOrder());
                    if(imageDto != null) {
                        if(processDto.getImages() == null) processDto.setImages(new ArrayList<>());
                        processDto.getImages().add(imageDto);
                    }
                }
            }

            // 서비스 호출
            myOwnRecipeService.createRecipe(dto, imageFile);

            return ResponseEntity.ok("레시피가 저장되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("레시피 저장에 실패했습니다.");
        }
    }

    //수정할 레시피 정보 조회 (미리보기)
    @GetMapping("/read/modifyRecipe/{recipeId}")
    public ResponseEntity<?> getRecipeForModification(@RequestHeader("Authorization") String token,
                                                      @PathVariable("recipeId") Long recipeId) {
        try {
            //JWT에서 userId 호출
            String accessToken = token.replace("Bearer ", "");
            Long userId = jwtUtil.getUserId(accessToken);   //로그인한 사용자 정보 추출

            //수정할 레시피 조회
            MyRecipeModifyReadResponseDto recipe = myOwnRecipeService.getRecipeForModification(recipeId, userId);

            return ResponseEntity.ok(recipe);
        } catch(Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("수정할 레시피 정보 조회에 실패했습니다.");
        }
    }

}
