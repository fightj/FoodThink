package com.ssafy.foodthink.elasticsearch.controller;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.InfoResponse;
import com.ssafy.foodthink.elasticsearch.dto.ElasticSearchRecipeDto;
import com.ssafy.foodthink.elasticsearch.entity.RecipeElasticEntity;
import com.ssafy.foodthink.elasticsearch.service.ElasticSearchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/elasticsearch")
public class ElasticController {
    private final ElasticsearchClient elasticsearchClient;
    private final ElasticSearchService elasticSearchService;

    public ElasticController(ElasticsearchClient elasticsearchClient, ElasticSearchService elasticSearchService) {
        this.elasticsearchClient = elasticsearchClient;
        this.elasticSearchService = elasticSearchService;
    }

    @GetMapping("/test")
    public String testConnection() {
        try {
            InfoResponse info = elasticsearchClient.info();
            return "Connected to Elasticsearch: " + info.version().number();
        } catch (Exception e) {
            return "Failed to connect to Elasticsearch: " + e.getMessage();
        }
    }

    @PostMapping("/index/recipe")
    public String indexAllRecipesWithIngredients(){
        elasticSearchService.indexAllRecipesWithIngredients();
        return "정상적으로 인덱싱이 성공했습니다.";
    }

    @GetMapping("/search/test")
    public List<ElasticSearchRecipeDto> searchRecipestest(@RequestParam String query) {
        return elasticSearchService.searchRecipes(query);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchRecipesTest(@RequestParam String query){
        return ResponseEntity.ok(elasticSearchService.getSearchedRecipe(query));
    }

    @GetMapping("/search/db")
    public ResponseEntity<?> searchRecipesTest2(@RequestParam String query){
        return ResponseEntity.ok(elasticSearchService.getSearchedRecipeTest(query));
    }

    // 성능 비교 결과 반환
    @GetMapping("/compare-performance")
    public ResponseEntity<String> compareSearchPerformance(@RequestParam String searchTerm) {
        elasticSearchService.compareSearchPerformance(searchTerm);
        return ResponseEntity.ok("성능 비교 완료");
    }

}
