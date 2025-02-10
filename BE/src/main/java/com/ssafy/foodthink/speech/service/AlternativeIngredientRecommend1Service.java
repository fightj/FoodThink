package com.ssafy.foodthink.speech.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.foodthink.global.GptService;
import com.ssafy.foodthink.recipes.entity.IngredientEntity;
import com.ssafy.foodthink.recipes.entity.RecipeEntity;
import com.ssafy.foodthink.recipes.repository.IngredientRepository;
import com.ssafy.foodthink.recipes.repository.RecipeRepository;
import com.ssafy.foodthink.user.entity.UserEntity;
import com.ssafy.foodthink.user.entity.UserInterestEntity;
import com.ssafy.foodthink.user.jwt.JWTUtil;
import com.ssafy.foodthink.user.repository.UserInterestRepository;
import com.ssafy.foodthink.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/*
    GPT API 활용 대체재료 추천
 */

@Service
@RequiredArgsConstructor
public class AlternativeIngredientRecommend1Service {

    private final GptService gptService;
    private final JWTUtil jwtUtil;
    private final UserRepository userRepository;
    private final UserInterestRepository userInterestRepository;
    private final RecipeRepository recipeRepository;
    private final IngredientRepository ingredientRepository;

    //대체 재료 추천
    public List<String> recommendAlternativeIngredients(String token, Long recipeId, String userInput) {
        //로그인 유무 확인 및 기피 재료 조회
        String avoidedIngredients = getDislikedIngredients(token);

        //레시피 ID에 해당하는 RecipeEntity 조회
        RecipeEntity recipeEntity = recipeRepository.findByRecipeId(recipeId);
//                .orElseThrow(() -> new RuntimeException("Recipe not found"));

        String recipeTitle = recipeEntity.getRecipeTitle(); //레시피 제목

        //레시피 ID에 해당하는 재료 목록 조회
        List<IngredientEntity> ingredients = ingredientRepository.findByRecipeEntity_RecipeId(recipeId);
        List<String> recipeIngredients = ingredients.stream()
                .map(IngredientEntity::getIngreName)
                .collect(Collectors.toList());

        // 프롬프트 구성
        String prompt = String.format(
                "너는 요리 전문가야. 사용자의 질문을 분석하여 재료의 대체재를 추천해야 해.\n\n" +
                        "### 사용자의 질문\n" +
                        "\"%s\"\n\n" +
                        "### 추가 정보\n" +
                        "- 현재 레시피 제목: \"%s\"\n" +
                        "- 현재 레시피 재료 목록: %s\n" +
                        "- 사용자의 기피 재료 목록: %s\n\n" +
                        "- **대체 재료는 한국 가정에서 자주 사용되는 재료를 기준으로 추천해줘**.\n\n" +
                        "**주의사항**\n" +
                        "1. 레시피 제목이 긴 문장일 수 있으니, 요리명만 추출해서 고려해.\n" +
                        "2. 사용자의 질문에서 대체하고 싶은 재료를 정확히 찾아야 해.\n" +
                        "3. 사용자가 기피하는 재료는 대체재로 추천하면 안 돼.\n" +
                        "4. 대체재는 1~3가지 추천해줘.\n" +
                        "5. 가급적 같은 용도로 사용할 수 있는 재료를 추천해.\n\n" +
                        "### **결과 형식**\n" +
                        "JSON 형식으로 반환해. JSON 이외의 설명을 절대 포함하지 마!\n" +
                        "```json\n" +
                        "{\n" +
                        "  \"alternative_ingredients\": [\"대체재1\", \"대체재2\", \"대체재3\"]\n" +
                        "}\n" +
                        "```",
                userInput, recipeTitle, String.join(", ", recipeIngredients), avoidedIngredients
        );

        //GPT에게 프롬프트 전송 및 결과 받기
        String gptResponse = gptService.callGptApi(prompt, 200, 0.7);

        //GPT 응답에서 대체 재료 목록 파싱
        return parseAlternativeIngredients(gptResponse);

    }

    // 기피 재료 조회
    private String getDislikedIngredients(String token) {
        if (token == null) {
            return "없음";  // 로그인하지 않은 경우
        }

        // JWT를 통해 유저 ID 가져오기
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);

        // 사용자의 기피 재료 조회
        UserEntity userEntity = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<UserInterestEntity> userInterests = userInterestRepository.findByUserId(userEntity);
        List<String> dislikedIngredients = new ArrayList<>();
        for (UserInterestEntity interest : userInterests) {
            if (!interest.getIsLiked()) {
                dislikedIngredients.add(interest.getIngredient());
            }
        }

        // 기피 재료가 없을 때
        return dislikedIngredients.isEmpty() ? "없음" : String.join(", ", dislikedIngredients);
    }

    private List<String> parseAlternativeIngredients(String gptResponse) {
        //GPT 응답을 분석하여 대체 재료 목록을 파싱하는 로직 필요
        //JSON 파싱 후 "alternative_ingredients" 값 반환
        try {
            // JSON 시작 위치 찾기
            int jsonStartIndex = gptResponse.indexOf("{");
            int jsonEndIndex = gptResponse.lastIndexOf("}");

            if (jsonStartIndex == -1 || jsonEndIndex == -1) {
                System.err.println("JSON 데이터가 올바르지 않습니다: " + gptResponse);
                return new ArrayList<>();
            }

            // JSON 부분만 추출
            String jsonResponse = gptResponse.substring(jsonStartIndex, jsonEndIndex + 1).trim();

            // JSON 파싱
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Object> responseMap = objectMapper.readValue(jsonResponse, Map.class);

            List<String> alternativeIngredients = (List<String>) responseMap.get("alternative_ingredients");

            return alternativeIngredients != null ? alternativeIngredients : new ArrayList<>();

        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("JSON 파싱 실패 : " + gptResponse);
            return new ArrayList<>();
        }
    }

}
