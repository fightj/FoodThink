package com.ssafy.foodthink.recipeBookmark.service;

import com.ssafy.foodthink.global.exception.AleadyExistsException;
import com.ssafy.foodthink.recipeBookmark.dto.RecipeBookmarkListDto;
import com.ssafy.foodthink.recipeBookmark.entity.RecipeBookmarkEntity;
import com.ssafy.foodthink.recipeBookmark.repository.RecipeBookmarkRepository;
import com.ssafy.foodthink.recipes.repository.RecipeRepository;
import com.ssafy.foodthink.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecipeBookmarkService {

    private final RecipeBookmarkRepository recipeBookmarkRepository;
    private final UserRepository userRepository;
    private final RecipeRepository recipeRepository;

    // 북마크 추가
    @Transactional
    public void createBookmark(Long userId, Long recipeId) {
        checkExistingBookmark(userId, recipeId); // 이미 사용자가 해당 레시피를 북마크 했는지 확인

        RecipeBookmarkEntity bookmark = RecipeBookmarkEntity.builder()
                .userEntity(userRepository.findById(userId)
                        .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다")))
                .recipeEntity(recipeRepository.findById(recipeId)
                        .orElseThrow(() -> new RuntimeException("레시피를 찾을 수 없습니다")))
                .writeTime(LocalDateTime.now())
                .build();

        recipeBookmarkRepository.save(bookmark);
    }

    // 북마크 확인
    private void checkExistingBookmark(Long userId, Long recipeId) {
        if (recipeBookmarkRepository.existsByUserEntity_UserIdAndRecipeEntity_RecipeId(userId, recipeId)) {
            throw new AleadyExistsException("이미 북마크된 레시피입니다");
        }
    }

    // 북마크 삭제
    @Transactional
    public void deleteBookmark(Long userId, Long recipeId) {
        RecipeBookmarkEntity bookmark = recipeBookmarkRepository
                .findByUserEntity_UserIdAndRecipeEntity_RecipeId(userId, recipeId)
                .orElseThrow(() -> new RuntimeException("북마크를 찾을 수 없습니다"));

        recipeBookmarkRepository.delete(bookmark);
    }

    // 사용자가 북마크한 레시피 전체 목록 조회 (recipeId 조회)
    public List<RecipeBookmarkListDto> readBookmarkedRecipes(Long userId) {
        List<RecipeBookmarkEntity> bookmarks = recipeBookmarkRepository.findByUserEntity_UserId(userId);
        return bookmarks.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private RecipeBookmarkListDto convertToDto(RecipeBookmarkEntity entity) {
        return new RecipeBookmarkListDto(entity.getRecipeEntity().getRecipeId());
    }

    // 해당 사용자가 해당 레시피를 북마크 했는지
    public boolean isBookmarked(Long userId, Long recipeId) {
        return recipeBookmarkRepository.existsByUserEntity_UserIdAndRecipeEntity_RecipeId(userId, recipeId);
    }



}
