package com.ssafy.foodthink.recipeBookmark.controller;

import com.ssafy.foodthink.recipeBookmark.dto.RecipeBookmarkListDto;
import com.ssafy.foodthink.recipeBookmark.service.RecipeBookmarkService;
import com.ssafy.foodthink.recipes.entity.RecipeEntity;
import com.ssafy.foodthink.user.jwt.JWTUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/bookmark")
@PreAuthorize("hasRole('USER')")
public class RecipeBookmarkController {

    private final RecipeBookmarkService recipeBookmarkService;
    private final JWTUtil jwtUtil;

    // 북마크 추가
    @PostMapping("/create/{recipeId}")
    public ResponseEntity<String> createBookmark(@RequestHeader("Authorization") String token, @PathVariable Long recipeId) {
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);

        recipeBookmarkService.createBookmark(userId, recipeId);

        return ResponseEntity.status(HttpStatus.CREATED).body("북마크가 추가되었습니다");
    }

    // 북마크 삭제
    @DeleteMapping("/delete/{recipeId}")
    public ResponseEntity<String> deleteBookmark(@RequestHeader("Authorization") String token,@PathVariable Long recipeId) {
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);

        recipeBookmarkService.deleteBookmark(userId, recipeId);

        return ResponseEntity.ok("북마크가 삭제되었습니다");
    }

    // 해당 사용자가 북마크한 레시피 목록 조회
    @GetMapping("/read/list")
    public ResponseEntity<List<RecipeBookmarkListDto>> getBookmarkedRecipes(@RequestHeader("Authorization") String token) {
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);

        List<RecipeBookmarkListDto> bookmarkedRecipes = recipeBookmarkService.readBookmarkedRecipes(userId);

        return ResponseEntity.ok(bookmarkedRecipes);
    }

    // 해당 사용자가 해당 레시피를 북마크 했는지 조회 
    @GetMapping("/read/{recipeId}")
    public ResponseEntity<Boolean> readBookmarkedRecipe(@RequestHeader("Authorization") String token, @PathVariable Long recipeId) {
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);

        boolean isBookmarked = recipeBookmarkService.isBookmarked(userId, recipeId);

        return ResponseEntity.ok(isBookmarked);
    }


}
