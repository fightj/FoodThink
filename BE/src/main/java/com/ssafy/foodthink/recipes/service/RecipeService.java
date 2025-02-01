package com.ssafy.foodthink.recipes.service;

import com.ssafy.foodthink.recipes.dto.*;
import com.ssafy.foodthink.recipes.entity.RecipeEntity;
import com.ssafy.foodthink.recipes.repository.RecipeBookMarkRepository;
import com.ssafy.foodthink.recipes.repository.RecipeListRepository;
import lombok.RequiredArgsConstructor;
import org.jsoup.internal.StringUtil;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RecipeService {

    private final RecipeListRepository recipeListRepository;
    private final RecipeBookMarkRepository recipeBookMarkRepository;

    //레시피 목록 조회
    //cateType, cateMainIngre, sorType을 파라미터값으로 받아 처리
    public List<RecipeListResponseDto> searchRecipeList(RecipeListRequestDto requestDto) {
        //기본값 설정
        //cateType과 cateMainIngre는 빈 문자열 또는 NULL
        //정렬 기준은 hits(조회순)
        String cateType = StringUtils.hasText(requestDto.getCateType()) ? requestDto.getCateType() : null;
        String cateMainIngre = StringUtils.hasText(requestDto.getCateMainIngre()) ? requestDto.getCateMainIngre() : null;
        String sortType = StringUtils.hasText(requestDto.getSortType()) ? requestDto.getSortType() : "조회순";

        List<RecipeEntity> recipeEntities = recipeListRepository.findRecipesByFilter(cateType, cateMainIngre, sortType);

        return recipeEntities.stream().map(recipeEntity -> {
            //북마크 개수 조회 (null 방지)
            Long bookmarkCount = Optional.ofNullable(recipeBookMarkRepository.countByRecipeEntity(recipeEntity)).orElse(0L);

            //로그인한 경우 북마크 여부 확인 (userId가 존재하면)
            boolean isBookmarked = false;
//            if (userId != null) {
//                isBookmarked = recipeBookMarkRepository.existsByRecipeEntityAndUserEntityUserId(recipeEntity, userId);
//            } //로그인 관련

            return new RecipeListResponseDto(
                    recipeEntity.getRecipeId(),
                    recipeEntity.getRecipeTitle(),
                    recipeEntity.getImage(),
                    recipeEntity.getUserEntity().getNickname(),
                    recipeEntity.getUserEntity().getImage(),
                    recipeEntity.getHits(),
                    bookmarkCount,
                    isBookmarked  // ⭐ 북마크 상태 추가
            );
        }).collect(Collectors.toList());
    }

    //캐러셀용 : 레시피 목록 20개를 조회순으로
    public List<RecipeListTop20ResponseDto> getTop20RecipesByHits() {
        //페이지 요청: 20개
        Pageable top20 = PageRequest.of(0, 20);

        //레시피 목록 조회
        List<RecipeEntity> recipeEntities = recipeListRepository.findTopRecipesByHits(top20);

        //DTO로 변환
        return recipeEntities.stream().map(recipeEntity -> new RecipeListTop20ResponseDto(
                recipeEntity.getRecipeId(),
                recipeEntity.getRecipeTitle(),
                recipeEntity.getImage(),
                recipeEntity.getUserEntity().getNickname(),
                recipeEntity.getUserEntity().getImage(),
                recipeEntity.getHits(),
                recipeBookMarkRepository.countByRecipeEntity(recipeEntity)  // 북마크 개수 조회
        )).collect(Collectors.toList());
    }

    //로그인 했을 때 : 구독한 사용자의 다른 레시피들 (20개) 목록 조회

    //레시피 상세 보기
    public RecipeDetailResponseDto getRecipeDetail(Long recipeId) {
        //레시피 조회
        RecipeEntity recipeEntity = recipeListRepository.findById(recipeId)
                .orElseThrow(() -> new IllegalArgumentException("해당 레시피가 존재하지 않습니다."));

        //재료 정보
        List<IngredientDto> ingredients = recipeEntity.getIngredients().stream()
                .map(ingredient -> new IngredientDto(ingredient.getIngreName(), ingredient.getAmount()))
                .collect(Collectors.toList());

        // 과정 정보 (이미지 포함)
        List<ProcessDto> processes = recipeEntity.getProcesses().stream()
                .map(step -> new ProcessDto(
                        step.getProcessOrder(),     //과정 순서
                        step.getProcessExplain(),   //과정 설명
                        step.getProcessImages() != null ?
                                step.getProcessImages().stream()
                                        .map(image -> new ProcessImageDto(image.getImageUrl()))
                                        .collect(Collectors.toList()) : Collections.emptyList()  // null 체크 후 처리
                ))
                .collect(Collectors.toList());

        // RecipeDetailResponseDto 반환
        return new RecipeDetailResponseDto(
                recipeEntity.getRecipeId(),
                recipeEntity.getRecipeTitle(),
                recipeEntity.getUserEntity().getNickname(),
                recipeEntity.getUserEntity().getImage(),
                recipeEntity.getServing(),
                recipeEntity.getLevel(),
                recipeEntity.getRequiredTime(),
                ingredients,
                processes
        );
    }
}

