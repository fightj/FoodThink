package com.ssafy.foodthink.elasticsearch.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.ElasticsearchException;
import co.elastic.clients.elasticsearch.core.IndexRequest;
import co.elastic.clients.elasticsearch.core.IndexResponse;
import com.ssafy.foodthink.elasticsearch.dto.ElasticSearchRecipeDto;
import com.ssafy.foodthink.elasticsearch.entity.RecipeElasticEntity;
import com.ssafy.foodthink.elasticsearch.repository.ElasticSearchRecipeRepository;
import com.ssafy.foodthink.recipeBookmark.repository.RecipeBookmarkRepository;
import com.ssafy.foodthink.recipes.dto.RecipeListResponseDto;
import com.ssafy.foodthink.recipes.entity.IngredientEntity;
import com.ssafy.foodthink.recipes.entity.RecipeEntity;
import com.ssafy.foodthink.recipes.repository.IngredientRepository;
import com.ssafy.foodthink.recipes.repository.RecipeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ElasticSearchService {
    private final ElasticsearchClient elasticsearchClient;
    private final RecipeRepository recipeRepository;
    private final IngredientRepository ingredientRepository;
    private final ElasticSearchRecipeRepository elasticSearchRecipeRepository;
    private final RecipeBookmarkRepository recipeBookmarkRepository;

    private static final Logger logger = LoggerFactory.getLogger(ElasticSearchService.class);


    public ElasticSearchService(ElasticsearchClient elasticsearchClient, RecipeRepository recipeRepository, IngredientRepository ingredientRepository, ElasticSearchRecipeRepository elasticSearchRecipeRepository, RecipeBookmarkRepository recipeBookmarkRepository) {
        this.elasticsearchClient = elasticsearchClient;
        this.recipeRepository = recipeRepository;
        this.ingredientRepository = ingredientRepository;
        this.elasticSearchRecipeRepository = elasticSearchRecipeRepository;
        this.recipeBookmarkRepository = recipeBookmarkRepository;
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
        // Elasticsearch에서 제목과 재료로 검색
        List<RecipeElasticEntity> recipeElasticEntities = elasticSearchRecipeRepository.findByRecipeTitleContainingIgnoreCaseOrIngredientsContainingIgnoreCase(searchTerm, searchTerm);

        // 검색된 엔티티에서 recipeId만 추출하여 리스트로 반환
        List<Long> recipeIds = recipeElasticEntities.stream()
                .map(RecipeElasticEntity::getRecipeId)  // RecipeElasticEntity에서 recipeId를 추출
                .collect(Collectors.toList());

        return recipeIds;
    }

//    public List<RecipeListResponseDto> getSearchedRecipe(List<Long> ids){
//        List<RecipeEntity> searchedRecipes = recipeRepository.findAllById(ids);
//        List<RecipeListResponseDto> recipeListResponseDtos = new ArrayList<>();
//        for (RecipeEntity searchedRecipe : searchedRecipes) {
//            RecipeListResponseDto recipeListResponseDto = new RecipeListResponseDto(searchedRecipe.getRecipeId(),
//                    searchedRecipe.getRecipeTitle(),
//                    searchedRecipe.getImage(),
//                    searchedRecipe.getUserEntity().getNickname(),
//                    searchedRecipe.getUserEntity().getImage(),
//                    searchedRecipe.getHits(),
//                    searchedRecipe.get)
//        }
//
//    }
}
