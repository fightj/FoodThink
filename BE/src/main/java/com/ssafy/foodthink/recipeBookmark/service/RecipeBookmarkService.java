package com.ssafy.foodthink.recipeBookmark.service;

import com.ssafy.foodthink.global.exception.AleadyExistsException;
import com.ssafy.foodthink.recipeBookmark.entity.RecipeBookmarkEntity;
import com.ssafy.foodthink.recipeBookmark.repository.RecipeBookmarkRepository;
import com.ssafy.foodthink.recipes.repository.RecipeRepository;
import com.ssafy.foodthink.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class RecipeBookmarkService {

    private final RecipeBookmarkRepository recipeBookmarkRepository;
    private final UserRepository userRepository;
    private final RecipeRepository recipeRepository;

    // 북마크 추가
    @Transactional
    public void createBookmark(Long userId, Long recipeId) {
        checkExistingBookmark(userId, recipeId);

        RecipeBookmarkEntity bookmark = RecipeBookmarkEntity.builder()
                .userId(userRepository.findById(userId)
                        .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다")))
                .recipeId(recipeRepository.findById(recipeId)
                        .orElseThrow(() -> new RuntimeException("레시피를 찾을 수 없습니다")))
                .writeTime(LocalDateTime.now())
                .build();

        recipeBookmarkRepository.save(bookmark);
    }
    // 북마크 확인
    private void checkExistingBookmark(Long userId, Long recipeId) {
        if (recipeBookmarkRepository.existsByUserId_UserIdAndRecipeId_RecipeId(userId, recipeId)) {
            throw new AleadyExistsException("이미 북마크된 레시피입니다");
        }
    }

}
