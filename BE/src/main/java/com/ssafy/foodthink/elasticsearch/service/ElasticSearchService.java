package com.ssafy.foodthink.elasticsearch.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.ElasticsearchException;
import co.elastic.clients.elasticsearch.core.IndexRequest;
import co.elastic.clients.elasticsearch.core.IndexResponse;
import com.ssafy.foodthink.elasticsearch.dto.ElasticSearchRecipeDto;
import com.ssafy.foodthink.elasticsearch.elasticsearchrepository.ElasticSearchFeedRepository;
import com.ssafy.foodthink.elasticsearch.entity.FeedElasticEntity;
import com.ssafy.foodthink.elasticsearch.entity.RecipeElasticEntity;
import com.ssafy.foodthink.elasticsearch.elasticsearchrepository.ElasticSearchRecipeRepository;
import com.ssafy.foodthink.feed.dto.FeedSummaryResponseDto;
import com.ssafy.foodthink.feed.entity.FeedEntity;
import com.ssafy.foodthink.feed.repository.FeedRepository;
import com.ssafy.foodthink.recipeBookmark.repository.RecipeBookmarkRepository;
import com.ssafy.foodthink.recipes.dto.RecipeListResponseDto;
import com.ssafy.foodthink.recipes.entity.IngredientEntity;
import com.ssafy.foodthink.recipes.entity.RecipeEntity;
import com.ssafy.foodthink.recipes.repository.IngredientRepository;
import com.ssafy.foodthink.recipes.repository.RecipeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ElasticSearchService {
    private final ElasticsearchClient elasticsearchClient;
    private final RecipeRepository recipeRepository;
    private final IngredientRepository ingredientRepository;
    private final ElasticSearchRecipeRepository elasticSearchRecipeRepository;
    private final RecipeBookmarkRepository recipeBookmarkRepository;
    private final FeedRepository feedRepository;
    private final ElasticSearchFeedRepository elasticSearchFeedRepository;

    private static final Logger logger = LoggerFactory.getLogger(ElasticSearchService.class);


    public ElasticSearchService(ElasticsearchClient elasticsearchClient, RecipeRepository recipeRepository, IngredientRepository ingredientRepository, ElasticSearchRecipeRepository elasticSearchRecipeRepository, RecipeBookmarkRepository recipeBookmarkRepository, FeedRepository feedRepository, ElasticSearchFeedRepository elasticSearchFeedRepository) {
        this.elasticsearchClient = elasticsearchClient;
        this.recipeRepository = recipeRepository;
        this.ingredientRepository = ingredientRepository;
        this.elasticSearchRecipeRepository = elasticSearchRecipeRepository;
        this.recipeBookmarkRepository = recipeBookmarkRepository;
        this.feedRepository = feedRepository;
        this.elasticSearchFeedRepository = elasticSearchFeedRepository;
    }

    //레시피와 재료를 하나의 DTO로 합쳐서 색인
    public void indexRecipeWithIngredients(RecipeEntity recipeEntity) {
        try {
            // Recipe와 관련된 Ingredient 가져오기
            List<String> ingredients = ingredientRepository.findByRecipeEntity_RecipeId(recipeEntity.getRecipeId())
                    .stream()
                    .map(IngredientEntity::getIngreName)
                    .collect(Collectors.toList());

            // RecipeDTO로 변환
            ElasticSearchRecipeDto elasticSearchRecipeDto = ElasticSearchRecipeDto.builder()
                    .recipeId(recipeEntity.getRecipeId())
                    .recipeTitle(recipeEntity.getRecipeTitle())
                    .ingredients(ingredients)
                    .build();

            // Elasticsearch에 색인
            IndexRequest<ElasticSearchRecipeDto> request = IndexRequest.of(i -> i
                    .index("recipes1")  // 색인 이름
                    .id(String.valueOf(recipeEntity.getRecipeId()))  // 문서 ID
                    .document(elasticSearchRecipeDto)  // 색인할 데이터
            );

            // Elasticsearch 클라이언트로 색인 요청
            IndexResponse response = elasticsearchClient.index(request);

            System.out.println("Indexed Recipe with Ingredients: " + response.id());
        } catch (ElasticsearchException e) {
            System.out.println("Elasticsearch error while indexing recipe with ingredients: " + e.getMessage());
        } catch (IOException e) {
            System.out.println("IO error while indexing recipe with ingredients: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Unexpected error while indexing recipe with ingredients: " + e.getMessage());
        }
    }

    // 모든 레시피와 관련된 재료들을 Elasticsearch에 색인하는 메서드
    public void indexAllRecipesWithIngredients() {
        for (RecipeEntity recipe : recipeRepository.findAll()) {
            indexRecipeWithIngredients(recipe);
        }
    }

    //레시피 검색(테스트)
    public List<ElasticSearchRecipeDto> searchRecipes(String searchTerm) {
        List<RecipeElasticEntity> recipeElasticEntities = elasticSearchRecipeRepository.findByRecipeTitleContainingIgnoreCaseOrIngredientsContainingIgnoreCase(searchTerm, searchTerm);

        // 검색 결과를 로그로 출력
        logger.info("검색된 레시피 개수: {}", recipeElasticEntities.size());
        logger.info("검색 결과: {}", recipeElasticEntities.get(0));

        List<ElasticSearchRecipeDto> elasticSearchRecipeDtos = new ArrayList<>();
        for (RecipeElasticEntity recipeElasticEntity : recipeElasticEntities) {
            ElasticSearchRecipeDto elasticSearchRecipeDto = ElasticSearchRecipeDto.builder()
                    .recipeId(recipeElasticEntity.getRecipeId())
                    .ingredients(recipeElasticEntity.getIngredients())
                    .recipeTitle(recipeElasticEntity.getRecipeTitle())
                    .build();
            elasticSearchRecipeDtos.add(elasticSearchRecipeDto);
        }

        return elasticSearchRecipeDtos;
    }

    public List<Long> searchRecipeIds(String searchTerm) {
        List<RecipeElasticEntity> recipeElasticEntities;

        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            // 검색어가 없으면 전체 레시피 조회
            recipeElasticEntities = elasticSearchRecipeRepository.findAll();
        } else {
            // 검색어가 있으면 제목 또는 재료에서 검색
            recipeElasticEntities = elasticSearchRecipeRepository.findByRecipeTitleContainingIgnoreCaseOrIngredientsContainingIgnoreCase(searchTerm, searchTerm);
        }

        // 검색된 엔티티에서 recipeId만 추출하여 리스트로 반환
        List<Long> recipeIds = recipeElasticEntities.stream()
                .map(RecipeElasticEntity::getRecipeId)  // RecipeElasticEntity에서 recipeId를 추출
                .collect(Collectors.toList());

        return recipeIds;
    }

    public List<RecipeListResponseDto> getSearchedRecipe(String searchTerm){
        List<Long> ids = searchRecipeIds(searchTerm);
        List<RecipeEntity> searchedRecipes = recipeRepository.findAllByRecipeIdInOrderByWriteTimeDesc(ids);
        List<RecipeListResponseDto> recipeListResponseDtos = new ArrayList<>();
        for (RecipeEntity searchedRecipe : searchedRecipes) {
            RecipeListResponseDto recipeListResponseDto = new RecipeListResponseDto(searchedRecipe.getRecipeId(),
                    searchedRecipe.getRecipeTitle(),
                    searchedRecipe.getImage(),
                    searchedRecipe.getUserEntity().getNickname(),
                    searchedRecipe.getUserEntity().getImage(),
                    searchedRecipe.getHits(),
                    (long) searchedRecipe.getRecipeBookmarkEntities().size()
                    );
            recipeListResponseDtos.add(recipeListResponseDto);
        }
        logger.info("검색 결과 갯수: " + String.valueOf(recipeListResponseDtos.size()));
        return  recipeListResponseDtos;
    }

    //엘라스틱서치와 비교용 테스트
    public List<RecipeListResponseDto> getSearchedRecipeTest(String searchTerm){
        List<Long> ids = searchRecipeIds(searchTerm);
        List<RecipeEntity> searchedRecipes = recipeRepository.findByNameAndIngredientNameContaining(searchTerm, searchTerm);
        List<RecipeListResponseDto> recipeListResponseDtos = new ArrayList<>();
        for (RecipeEntity searchedRecipe : searchedRecipes) {
            RecipeListResponseDto recipeListResponseDto = new RecipeListResponseDto(searchedRecipe.getRecipeId(),
                    searchedRecipe.getRecipeTitle(),
                    searchedRecipe.getImage(),
                    searchedRecipe.getUserEntity().getNickname(),
                    searchedRecipe.getUserEntity().getImage(),
                    searchedRecipe.getHits(),
                    (long) searchedRecipe.getRecipeBookmarkEntities().size()
            );
            recipeListResponseDtos.add(recipeListResponseDto);
        }
        logger.info("검색 결과 갯수: " + String.valueOf(recipeListResponseDtos.size()));
        return  recipeListResponseDtos;
    }

    public void compareSearchPerformance(String searchTerm) {
        // JPA 검색 시간 측정
        long jpaStartTime = System.currentTimeMillis();
        List<RecipeListResponseDto> jpaRecipes = getSearchedRecipe(searchTerm);
        long jpaEndTime = System.currentTimeMillis();
        long jpaDuration = jpaEndTime - jpaStartTime;
        logger.info("JPA 검색 실행 시간: " + jpaDuration + "ms");

        // Elasticsearch 검색 시간 측정
        long elasticsearchStartTime = System.currentTimeMillis();
        List<RecipeListResponseDto> elasticsearchRecipes = getSearchedRecipeTest(searchTerm);
        long elasticsearchEndTime = System.currentTimeMillis();
        long elasticsearchDuration = elasticsearchEndTime - elasticsearchStartTime;
        logger.info("Elasticsearch 검색 실행 시간: " + elasticsearchDuration + "ms");
    }

    @Scheduled(cron = "0 0 2 * * ?")  // 크론식으로 작성, 매일 오전 2시에 실행되도록 만들었습니다.
    public void runBatchUpdate() {
        // 배치 작업 처리 로직
        logger.info("배치 작업을 시작합니다.");

        try{
            // Elasticsearch와 관련된 배치 작업 처리
            // 1. 하루 전날을 기준으로 레시피를 조회 (하루 전날 이후에 추가된 레시피만)
            LocalDateTime lastBatchTime = LocalDateTime.now().minusDays(1).withHour(0).withMinute(0).withSecond(0).withNano(0);

            // 2. 레시피 추가 시간 이후의 레시피를 DB에서 조회
            List<RecipeEntity> newRecipes = recipeRepository.findByWriteTimeAfter(lastBatchTime);

            for (RecipeEntity recipeEntity : newRecipes) {
                try {
                    // 3. Elasticsearch에 이미 존재하는지 체크
                    boolean exists = elasticSearchRecipeRepository.existsById(String.valueOf(recipeEntity.getRecipeId()));

                    // 4. Elasticsearch에 존재하지 않으면 인덱싱
                    if (!exists) {
                        indexRecipeWithIngredients(recipeEntity);
                        logger.info("인덱싱 완료: 레시피 ID {}", recipeEntity.getRecipeId());
                    }
                } catch (Exception e) {
                    logger.error("배치 작업 중 오류 발생, 레시피 ID: {}", recipeEntity.getRecipeId(), e);
                }
            }

            // 5. 마지막 배치 시간 업데이트
            logger.info("배치 작업 완료, 마지막 배치 시간: {}", lastBatchTime);
        }catch (Exception e) {
            logger.error("배치 작업 중 예기치 않은 오류 발생", e);
        }

    }

    //작성순 페이지네이션 처리
    public Page<RecipeListResponseDto> getSearchedRecipe(String searchTerm, int page, int size, String orderBy, String cateType, String cateMainIngre) {
        List<Long> ids = searchRecipeIds(searchTerm);

        // Pageable 설정
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Order.desc("writeTime")));

        // 페이지네이션 처리
        Page<RecipeEntity> pageResult;

        // 정렬 방식에 따라 적절한 Repository 메서드 호출
        switch (orderBy.toLowerCase()) {
            case "hits": // 조회순
                pageResult = recipeRepository.findAllByRecipeIdInOrderByHitsDesc(ids, cateType, cateMainIngre, pageable);
                break;
            case "bookmarks": // 북마크 개수순
                pageResult = recipeRepository.findAllByRecipeIdInOrderByBookmarkCountDesc(ids, cateType, cateMainIngre, pageable);
                break;
            default: // 기본값 (작성 시간순)
                pageResult = recipeRepository.findAllByRecipeIdInOrderByWriteTimeDesc(ids, cateType, cateMainIngre, pageable);
                break;
        }

        // Page를 RecipeListResponseDto로 변환
        List<RecipeListResponseDto> recipeListResponseDtos = pageResult.stream()
                .map(searchedRecipe -> new RecipeListResponseDto(
                        searchedRecipe.getRecipeId(),
                        searchedRecipe.getRecipeTitle(),
                        searchedRecipe.getImage(),
                        searchedRecipe.getUserEntity().getNickname(),
                        searchedRecipe.getUserEntity().getImage(),
                        searchedRecipe.getHits(),
                        (long) searchedRecipe.getRecipeBookmarkEntities().size()
                ))
                .collect(Collectors.toList());

        logger.info("검색 결과 갯수: " + recipeListResponseDtos.size());

        // Page로 결과 반환 (페이지 번호, 페이지 크기, 전체 아이템 수 등을 함께 반환)
        return new PageImpl<>(recipeListResponseDtos, pageable, pageResult.getTotalElements());
    }


    //피드 엘라스틱 서치
    //인덱스 등록(하나)
    public void indexFeed(FeedEntity feedEntity){
        FeedElasticEntity feedElasticEntity = new FeedElasticEntity();
        feedElasticEntity.setFeedId(feedEntity.getId());
        feedElasticEntity.setNickname(feedEntity.getUserEntity().getNickname());
        feedElasticEntity.setFoodName(feedEntity.getFoodName());

        IndexRequest<FeedElasticEntity> request = IndexRequest.of(i -> i
                .index("feed1")
                .id(String.valueOf(feedEntity.getId()))
                .document(feedElasticEntity)
        );

        try {
            elasticsearchClient.index(request);
        } catch (Exception e) {
            e.printStackTrace(); // 예외 처리
        }

    }
    //모든 인덱스 등록
    public void indexAllFeed(){
        List<FeedEntity> feedEntities = feedRepository.findAll();
        for (FeedEntity feedEntity : feedEntities) {
            indexFeed(feedEntity);
        }
    }

    public List<Long> getSearchFeedIds(String query) {
        List<FeedElasticEntity> feedElasticEntities;

        if (query == null || query.trim().isEmpty()) {
            feedElasticEntities = elasticSearchFeedRepository.findAll();
        } else {
            feedElasticEntities = elasticSearchFeedRepository.findByNicknameContainingIgnoreCaseOrFoodNameContainingIgnoreCase(query, query);
        }

        List<Long> feedIds = feedElasticEntities.stream()
                .map(FeedElasticEntity::getFeedId)
                .toList();

        return feedIds;
    }

    public Page<FeedSummaryResponseDto> getSearchFeeds(String query, int page, int size){
        List<Long> feedIds = getSearchFeedIds(query);

        // Pageable 설정
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Order.desc("writeTime")));

        // 페이지네이션 처리
        Page<FeedEntity> pageResult = feedRepository.findByIdIn(feedIds, pageable);
        List<FeedSummaryResponseDto> feedSummaryResponseDtos = new ArrayList<>();
        for (FeedEntity feedEntity : pageResult) {
            FeedSummaryResponseDto feedSummaryResponseDto = FeedSummaryResponseDto.builder()
                    .id(feedEntity.getId())
                    .image(feedEntity.getImages().get(0).getImageUrl())
                    .userNickname(feedEntity.getUserEntity().getNickname())
                    .userImage(feedEntity.getUserEntity().getImage())
                    .imageSize(feedEntity.getImages().size())
                    .build();
            feedSummaryResponseDtos.add(feedSummaryResponseDto);
        }
        //new PageImpl<>(recipeListResponseDtos, pageable, pageResult.getTotalElements());
        return new PageImpl<>(feedSummaryResponseDtos, pageable, pageResult.getTotalElements());
    }

}
