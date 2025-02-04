package com.ssafy.foodthink.recipes.service;

import com.ssafy.foodthink.recipeBookmark.repository.RecipeBookmarkRepository;
import com.ssafy.foodthink.recipes.dto.*;
import com.ssafy.foodthink.recipes.entity.ProcessEntity;
import com.ssafy.foodthink.recipes.entity.RecipeEntity;
import com.ssafy.foodthink.recipes.repository.RecipeListRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
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
    private final RecipeBookmarkRepository recipeBookmarkRepository;

    //레시피 목록 조회
    //cateType, cateMainIngre, sorType을 파라미터값으로 받아 처리
    public RecipeListPageResponseDto searchRecipeList(RecipeListRequestDto requestDto) {
        //기본값 설정
        String cateType = StringUtils.hasText(requestDto.getCateType()) ? requestDto.getCateType() : null;
        String cateMainIngre = StringUtils.hasText(requestDto.getCateMainIngre()) ? requestDto.getCateMainIngre() : null;
        String sortType = StringUtils.hasText(requestDto.getSortType()) ? requestDto.getSortType() : "조회순";

        //페이지 번호, 사이즈
        int page = requestDto.getPage();
        int size = requestDto.getSize();

        //레시피 목록 조회 (페이지네이션 적용)
        Pageable pageable = PageRequest.of(page, size);
        Page<RecipeEntity> recipePage = recipeListRepository.findRecipesByFilter(cateType, cateMainIngre, sortType, pageable);

        //총 레시피 수와 총 페이지 수
        int totalRecipes = (int) recipePage.getTotalElements();
        int totalPages = recipePage.getTotalPages();

        //레시피 목록 DTO로 변환
        List<RecipeListResponseDto> recipes = recipePage.getContent().stream().map(recipeEntity -> {
            // 북마크 개수 조회 (null 방지)
            Long bookmarkCount = Optional.ofNullable(recipeBookmarkRepository.countByRecipeEntity(recipeEntity)).orElse(0L);

            return new RecipeListResponseDto(
                    recipeEntity.getRecipeId(),
                    recipeEntity.getRecipeTitle(),
                    recipeEntity.getImage(),
                    recipeEntity.getUserEntity().getNickname(),
                    recipeEntity.getUserEntity().getImage(),
                    recipeEntity.getHits(),
                    bookmarkCount
            );
        }).collect(Collectors.toList());

        //페이지네이션 응답 DTO 반환
        return new RecipeListPageResponseDto(recipes, totalRecipes, totalPages, page);
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
                recipeBookmarkRepository.countByRecipeEntity(recipeEntity)  // 북마크 개수 조회
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
                recipeEntity.getImage(),
                recipeEntity.getUserEntity().getNickname(),
                recipeEntity.getUserEntity().getImage(),
                recipeEntity.getServing(),
                recipeEntity.getLevel(),
                recipeEntity.getRequiredTime(),
                recipeEntity.getHits(),
                ingredients,
                processes
        );
    }

    //레시피 보기 : 요리 과정 중 재료 정보 (첫페이지)
    //재료 정보
    public List<IngredientDto> getIngredients(Long recipeId) {
        //레시피 조회
        RecipeEntity recipeEntity = recipeListRepository.findById(recipeId)
                .orElseThrow(() -> new IllegalArgumentException("해당 레시피가 존재하지 않습니다."));

        //재료 정보 가져오기
        return recipeEntity.getIngredients().stream()
                .map(ingredient -> new IngredientDto(ingredient.getIngreName(), ingredient.getAmount()))
                .collect(Collectors.toList());
    }

    //레시피 보기 : 요리 과정 중 페이지별로 과정 보기
    //과정 정보 + 페이지네이션 정보
    public ProcessPageResponseDto getProcessPage(Long recipeId, int page) {
        // 레시피 조회
        RecipeEntity recipeEntity = recipeListRepository.findById(recipeId)
                .orElseThrow(() -> new IllegalArgumentException("해당 레시피가 존재하지 않습니다."));

        // 과정 정보 가져오기
        List<ProcessEntity> processEntities = recipeEntity.getProcesses();

        // 페이지 단위로 데이터를 나누기
        int startIndex = page * 1; // 한 페이지에 1개 과정만 보여주기
        int endIndex = Math.min((page + 1) * 1, processEntities.size());

        List<ProcessDto> processes = processEntities.subList(startIndex, endIndex).stream()
                .map(process -> new ProcessDto(
                        process.getProcessOrder(),
                        process.getProcessExplain(),
                        process.getProcessImages().stream()
                                .map(image -> new ProcessImageDto(image.getImageUrl()))
                                .collect(Collectors.toList())
                ))
                .collect(Collectors.toList());

        // 총 과정 수와 총 페이지 수 계산
        int totalProcess = processEntities.size();   // 필드 이름 변경
        int totalPages = (int) Math.ceil((double) totalProcess / 1);  // 한 페이지에 1개씩 표시

        return new ProcessPageResponseDto(processes, totalProcess, totalPages, page);

    }



}

