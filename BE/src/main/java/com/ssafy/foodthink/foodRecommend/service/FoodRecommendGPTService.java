package com.ssafy.foodthink.foodRecommend.service;

import com.ssafy.foodthink.foodRecommend.dto.RecipeRecommendDto;
import com.ssafy.foodthink.foodRecommend.dto.UserLikedInputDto;
import com.ssafy.foodthink.global.GptService;
import lombok.RequiredArgsConstructor;
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

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.json.JSONObject;

@Service
@RequiredArgsConstructor
public class FoodRecommendGPTService {

    private static final Logger logger = LoggerFactory.getLogger(FoodRecommendGPTService.class);

    @Value("${weather.api.url}")
    private String weatherApiUrl;

    @Value("${weather.api.key}")
    private String weatherApiKey;

    private final GptService gptService;

    public List<Long> getRecipeRecommendation(List<RecipeRecommendDto> recommendations, UserLikedInputDto userInput) {
        String weatherInfo = getWeatherInfo("Seoul");

        String prompt = String.format(
                "### 현재 날씨 ###\n%s\n\n"
                        + "### 사용자 취향 분석 ###\n"
                        + "1. %s\n2. %s\n3. %s\n4. %s\n5. %s\n\n"
                        + "### 추천 후보 목록 ###\n%s\n\n"
                        + "### 요청 사항 ###\n"
                        + "- 추천 후보 목록 중에서 현재 날씨와 사용자 취향 분석을 반영한 상위 3개 요리 선정\n"
                        + "- 선정된 상위 3개 요리의 레시피 ID만 리스트 형태로 응답\n"
                        + "예시 응답 형식: [1234, 5678, 9012]",
                weatherInfo,
                formatUserPreferences(userInput.getAnswers()),
                recommendations.stream()
                        .map(this::formatRecipeInfo)
                        .collect(Collectors.joining("\n\n"))
        );

        String gptResponse = gptService.callGptApi(prompt, 150, 0.3);
        return parseRecipeIds(gptResponse);
    }

    // 레시피 정보를 문자열로 포맷팅
    private String formatRecipeInfo(RecipeRecommendDto recipe) {
        return String.format(
                "레시피 ID: %d\n제목: %s\n종류: %s\n소요 시간: %s\n재료: %s\n난이도: %d\n과정 수: %d\n유사도: %.2f",
                recipe.getRecipeId(),
                recipe.getRecipeTitle(),
                recipe.getCateType(),
                recipe.getRequiredTime(),
                String.join(", ", recipe.getIngredients()),
                recipe.getLevel(),
                recipe.getProcessCount(),
                recipe.getSimilarity()
        );
    }

    // 사용자 선호도를 문자열로 포맷팅
    private String formatUserPreferences(List<String> answers) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < answers.size(); i++) {
            sb.append(String.format("%d. %s\n", i + 1, answers.get(i)));
        }
        return sb.toString();
    }

    // GPT 응답에서 레시피 ID를 파싱
    private List<Long> parseRecipeIds(String gptResponse) {
        try {
            // 대괄호 안의 내용만 추출
            String idsString = gptResponse.replaceAll(".*\\[(.*?)\\].*", "$1");
            // 쉼표로 분리, Long으로 변환
            return Arrays.stream(idsString.split(","))
                    .map(String::trim)
                    .map(Long::parseLong)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("GPT 응답 파싱 중 오류 발생: ", e);
            throw new RuntimeException("레시피 ID 파싱 중 오류가 발생했습니다.", e);
        }
    }

    // 날씨 API 사용하여 날씨 정보 가져옴
    public String getWeatherInfo(String city) {
        OkHttpClient client = new OkHttpClient(); // HTTP 요청을 보내기 위한 클라이언트 생성
        String url = String.format(weatherApiUrl, city, weatherApiKey);

        Request request = new Request.Builder().url(url).build(); // HTTP GET 요청 생성

        try {
            // HTTP 요청 실행 및 JSON 객체로 파싱
            Response response = client.newCall(request).execute();
            String jsonData = response.body().string();
            JSONObject json = new JSONObject(jsonData);

            double temp = json.getJSONObject("main").getDouble("temp");
            String description = json.getJSONArray("weather").getJSONObject(0).getString("description");

            return String.format("현재 %s의 날씨: %.1f°C, %s", city, temp, description);
        } catch (Exception e) {
            return "날씨 정보를 가져오는데 실패했습니다.";
        }
    }


}
