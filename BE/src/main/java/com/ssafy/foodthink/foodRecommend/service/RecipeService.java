package com.ssafy.foodthink.foodRecommend.service;

import com.ssafy.foodthink.another.UserRecipeMarkEntity;
import com.ssafy.foodthink.foodRecommend.dto.RecipeInfoDto;
import com.ssafy.foodthink.foodRecommend.repository.CrawlingMarkRepository;
import com.ssafy.foodthink.foodRecommend.repository.CrawlingRecipeRepository;
import com.ssafy.foodthink.foodRecommend.repository.UserRecipeMarkRepository;
import com.ssafy.foodthink.foodRecommend.repository.UserRecipeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecipeService {
    private final UserRecipeMarkRepository userRecipeMarkRepository;
    private final CrawlingMarkRepository crawlingMarkRepository;

    public List<String> getRecipeNames(Long userId) {
        List<String> recipeNames = new ArrayList<>();

        // 사용자 레시피 요리명 추출
        List<RecipeInfoDto> userRecipes = userRecipeMarkRepository.findRecipeInfoByUserId(userId);
        recipeNames.addAll(userRecipes.stream()
                .map(RecipeInfoDto::getRecipeName)
                .collect(Collectors.toList()));

        // 크롤링 레시피 요리명 추출
        List<RecipeInfoDto> crawlingRecipes = crawlingMarkRepository.findRecipeInfoByUserId(userId);
        recipeNames.addAll(crawlingRecipes.stream()
                .map(RecipeInfoDto::getRecipeName)
                .collect(Collectors.toList()));

        return recipeNames;
    }
}

