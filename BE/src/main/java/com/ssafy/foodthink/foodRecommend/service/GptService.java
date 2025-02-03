package com.ssafy.foodthink.foodRecommend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Service
public class GptService {

    private static final Logger logger = LoggerFactory.getLogger(GptService.class);

    @Value("${gpt.api.url}")
    private String gptApiUrl;

    @Value("${gpt.api.key}")
    private String apiKey;

    public String getRecipeRecommendation(String likedIngredients, String dislikedIngredients) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        String prompt = String.format("선호 재료: %s\n기피 재료: %s\n이 재료들을 고려해서 요리 3개를 추천해주세요.", likedIngredients, dislikedIngredients);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-3.5-turbo");
        requestBody.put("messages", Arrays.asList(Map.of("role", "user", "content", prompt)));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(gptApiUrl, entity, Map.class);
        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
        return (String) message.get("content");
    }
//public String getRecipeRecommendation(String likedIngredients, String dislikedIngredients) {
//    logger.info("Sending request to GPT API with liked ingredients: {} and disliked ingredients: {}", likedIngredients, dislikedIngredients);
//
//    RestTemplate restTemplate = new RestTemplate();
//    HttpHeaders headers = new HttpHeaders();
//    headers.setContentType(MediaType.APPLICATION_JSON);
//    headers.setBearerAuth(apiKey);
//
//    String prompt = String.format("선호 재료: %s\n기피 재료: %s\n이 재료들을 고려해서 요리 3개를 추천해주세요.", likedIngredients, dislikedIngredients);
//    logger.debug("Generated prompt: {}", prompt);
//
//    Map<String, Object> requestBody = new HashMap<>();
//    requestBody.put("model", "gpt-3.5-turbo");
//    requestBody.put("messages", Arrays.asList(Map.of("role", "user", "content", prompt)));
//
//    HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
//
//    try {
//        ResponseEntity<Map> response = restTemplate.postForEntity(gptApiUrl, entity, Map.class);
//        logger.debug("Received response from GPT API: {}", response.getBody());
//
//        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
//        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
//        String content = (String) message.get("content");
//
//        logger.info("Successfully generated recipe recommendations");
//        return content;
//    } catch (Exception e) {
//        logger.error("Error occurred while calling GPT API", e);
//        throw new RuntimeException("Failed to get recipe recommendations from GPT", e);
//    }
//}

}
