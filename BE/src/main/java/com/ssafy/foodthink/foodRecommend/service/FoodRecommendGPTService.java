package com.ssafy.foodthink.foodRecommend.service;

import com.ssafy.foodthink.foodRecommend.dto.RecipeRecommendDto;
import com.ssafy.foodthink.foodRecommend.dto.UserLikedInputDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Service
public class FoodRecommendGPTService {

    private static final Logger logger = LoggerFactory.getLogger(FoodRecommendGPTService.class);

    @Value("${gpt.api.url}")
    private String gptApiUrl;

    @Value("${gpt.api.key}")
    private String apiKey;

    public String getRecipeRecommendation(List<RecipeRecommendDto> recommendations, UserLikedInputDto userInput) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        // GPT 프롬프트
        String prompt = String.format(
                "### 사용자 취향 분석 ###\n"
                        + "1. %s\n2. %s\n3. %s\n4. %s\n5. %s\n\n"
                        + "### 추천 후보 목록 ###\n%s\n\n"
                        + "### 요청 사항 ###\n"
                        + "- 추천 후보 목록 중에서 사용자 취향 분석을 반영한 상위 3개 요리 선정",
                userInput.getFirstAnswer(),
                userInput.getSecondAnswer(),
                userInput.getThirdAnswer(),
                userInput.getFourthAnswer(),
                userInput.getFifthAnswer(),
                recommendations.stream()
                        .map(RecipeRecommendDto::getRecipeTitle)
                        .collect(Collectors.joining("\n"))
        );

        // API 요청 본문 구성
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-3.5-turbo");
        requestBody.put("messages", Collections.singletonList(
                new HashMap<String, String>() {{
                    put("role", "user");
                    put("content", prompt);
                }}
        ));

        // API 호출
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(gptApiUrl, entity, Map.class);

        // 응답 처리
        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
        return (String) message.get("content");
    }

}
