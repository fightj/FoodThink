package com.ssafy.foodthink.recipes.service;

import com.ssafy.foodthink.recipes.dto.RecipeListRequestDto;
import com.ssafy.foodthink.recipes.dto.RecipeListResponseDto;
import com.ssafy.foodthink.recipes.entity.RecipeEntity;
import com.ssafy.foodthink.recipes.repository.RecipeBookMarkRepository;
import com.ssafy.foodthink.recipes.repository.RecipeListRepository;
import lombok.RequiredArgsConstructor;
import org.jsoup.internal.StringUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RecipeService {

    private final RecipeListRepository recipeListRepository;
    private final RecipeBookMarkRepository recipeBookMarkRepository;

    public List<RecipeListResponseDto> searchRecipeList(RecipeListRequestDto requestDto) {
        //기본값 설정
        //cateType과 cateMainIngre는 빈 문자열 또는 NULL
        //정렬 기준은 hits(조회수 순)
        String cateType = StringUtils.hasText(requestDto.getCateType()) ? requestDto.getCateType() : null;
        String cateMainIngre = StringUtils.hasText(requestDto.getCateMainIngre()) ? requestDto.getCateMainIngre() : null;
        String sortType = StringUtils.hasText(requestDto.getSortType()) ? requestDto.getSortType() : "조회수";

        List<RecipeEntity> recipeEntities = recipeListRepository.findRecipesByFilter(cateType, cateMainIngre, sortType);

        return recipeEntities.stream().map(recipeEntity -> new RecipeListResponseDto(
                recipeEntity.getRecipeId(),
                recipeEntity.getRecipeTitle(),
                recipeEntity.getImage(),
                recipeEntity.getUserEntity().getNickname(),
                recipeEntity.getUserEntity().getImage(),
                recipeEntity.getHits(),
                recipeBookMarkRepository.countByRecipeEntity(recipeEntity)  //북마크 개수 조회
        )).collect(Collectors.toList());
    }

}
