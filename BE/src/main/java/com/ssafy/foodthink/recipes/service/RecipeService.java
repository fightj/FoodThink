//package com.ssafy.foodthink.recipes.service;
//
//import com.ssafy.foodthink.recipes.dto.AllRecipeListResponseDto;
//import com.ssafy.foodthink.recipes.entity.AllRecipeListViewEntity;
//import com.ssafy.foodthink.recipes.repository.AllRecipeListViewRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.stereotype.Service;
//
//@Service
//@RequiredArgsConstructor
//public class RecipeService {
//
//    private final AllRecipeListViewRepository recipeListViewRepository;
//
//    //모든 레시피 조회 : 최신순, 조회순, 난이도순
//    public Page<AllRecipeListResponseDto> findAllRecipes(String sortType, Pageable pageable) {
//        //정렬에 따른 테이더 조회
//        Page<AllRecipeListViewEntity> recipes = switch (sortType) {
//            case "latest" -> recipeListViewRepository.findAllByLatest(pageable);
//            case "hits" -> recipeListViewRepository.findAllByHits(pageable);
//            case "level" -> recipeListViewRepository.findAllByLevel(pageable);
//            default -> Page.empty(pageable);
//        };
//        //DTO 변환
//        return recipes.map(this::convertToDto);
//    }
//
//    //entity -> dto
//    private AllRecipeListResponseDto convertToDto(AllRecipeListViewEntity entity) {
//        return new AllRecipeListResponseDto(
//                entity.getRecipeId(),
//                entity.getRecipeTitle(),
//                entity.getHits(),
//                entity.getRecipeUrl(),
//                entity.getImage()
//        );
//    }
//
//
//
//
////    private final UserRecipesRepository userRecipesRepository;
////    private final CrawlingRecipesRepository crawlingRecipesRepository;
////
////    ///  //////////////////////////////////
////
////    //모든 레시피 조회 : 나만의레시피 + 크롤링레시피
////    public Page<AllRecipeListResponseDto> findAllRecipes(String sortType, Pageable pageable) {
////        //각 테이블에서 데이터 조회
////        Page<UserRecipeEntity> userRecipes = fetchUserRecipes(sortType, pageable);
////        Page<CrawlingRecipeEntity> crawlingRecipes = fetchCrawlingRecipes(sortType, pageable);
////
////        //DTO 변환
////        List<AllRecipeListResponseDto> combinedDto = Stream.concat(
////                userRecipes.getContent().stream().map(this::convertUserRecipesListToDto),
////                crawlingRecipes.getContent().stream().map(this::convertCrawlingRecipesListToDto)
////        ).collect(Collectors.toList());
////
////        //페이지네이션 처리
////        return new PageImpl<>(combinedDto, pageable,
////                userRecipes.getTotalElements() + crawlingRecipes.getTotalElements());
////    }
////
////    //나만의레시피 정렬에 따른 조회
////    private Page<UserRecipeEntity> fetchUserRecipes(String sortType, Pageable pageable) {
////        return switch (sortType) {
////            case "latest" -> userRecipesRepository.findPublicRecipesByWriteTime(pageable);
////            case "hits" -> userRecipesRepository.findPublicRecipesByHits(pageable);
////            case "level" -> userRecipesRepository.findPublicRecipesByLevel(pageable);
////            default -> Page.empty(pageable);
////        };
////    }
////
////    //크롤링레시피 정렬에 따른 조회
////    private Page<CrawlingRecipeEntity> fetchCrawlingRecipes(String sortType, Pageable pageable) {
////        return switch (sortType) {
////            case "latest" -> crawlingRecipesRepository.findCrawlingRecipesByWriteTime(pageable);
////            case "hits" -> crawlingRecipesRepository.findCrawlingRecipesByHits(pageable);
////            case "level" -> crawlingRecipesRepository.findCrawlingRecipesByLevel(pageable);
////            default -> Page.empty(pageable);
////        };
////    }
////
////    //entity -> dto
////    private AllRecipeListResponseDto convertUserRecipesListToDto(UserRecipeEntity entity) {
////        return new AllRecipeListResponseDto(entity.getRecipeId(), entity.getRecipeTitle(),
////                entity.getHits(), entity.getRecipeUrl(), entity.getImage());
////    }
////
////    //entity -> dto
////    private AllRecipeListResponseDto convertCrawlingRecipesListToDto(CrawlingRecipeEntity entity) {
////        return new AllRecipeListResponseDto(entity.getRecipeId(), entity.getRecipeTitle(),
////                entity.getHits(), entity.getRecipeUrl(), entity.getImage());
////    }
//
//    ///  //////////////////////////////////
//
//    //레시피 상세 보기 기능 구현 예정
//
//    ///  //////////////////////////////////
//
//    ///  //////////////////////////////////
//
//    ///  //////////////////////////////////
//
//    ///  //////////////////////////////////
//
//}
