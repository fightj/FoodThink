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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/*
    GPT API 활용 대체재료 추천2
 */

@Service
@RequiredArgsConstructor
public class AlternativeIngredientRecommend2Service {

    private final GptService gptService;
    private final JWTUtil jwtUtil;
    private final UserRepository userRepository;
    private final UserInterestRepository userInterestRepository;
    private final RecipeRepository recipeRepository;
    private final IngredientRepository ingredientRepository;

    //대체 재료 추천
    public Map<String, Object> recommendAlternativeIngredients(String token, Long recipeId, String userInput) {
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

        String prompt = String.format(
                "너는 요리 전문가야. 사용자의 질문을 분석하여 대체할 재료와 그 대체 재료를 추출하고, 그에 맞는 대체 재료를 추천해야 해.\n\n" +
                        "### 사용자의 질문\n" +
                        "\"%s\"\n\n" +
                        "### 추가 정보\n" +
                        "- 현재 레시피 제목: \"%s\"\n" +
                        "- 현재 레시피 재료 목록: %s\n" +
                        "- 사용자의 기피 재료 목록: %s\n" +
                        "- **대체 재료는 한국 가정에서 자주 사용되는 재료를 기준으로 추천해줘**.\n\n" +
                        "**주의사항**\n" +
                        "1. 레시피 제목이 긴 문장일 수 있으니, 요리명만 추출해서 고려해.\n" +
                        "2. 사용자가 질문에서 대체하고 싶은 재료를 정확히 찾아야 해.\n" +
                        "3. 사용자가 기피하는 재료는 대체재로 추천하면 안 돼.\n" +
                        "4. 대체 재료를 1~3개 추천하고, 가급적 같은 용도로 사용할 수 있는 재료를 추천해줘.\n\n" +
                        "### **결과 형식**\n" +
                        "JSON 형식으로 반환해.\n" +
                        "```json\n" +
                        "{\n" +
                        "  \"alternative_ingredients\": [\"대체재1\", \"대체재2\", \"대체재3\"],\n" +
                        "  \"message\": \"긍정 또는 부정 메시지를 간결하게 작성\"\n" +
                        "}\n" +
                        "```\n\n" +
                        "### **부정적인 답변 처리**\n" +
                        "만약 사용자가 요청한 대체 재료가 적합하지 않다면, 적합한 대체 재료를 **새롭게 추천**해줘.\n" +
                        "대체 재료가 적합하지 않은 이유를 구체적으로 설명하지 않고, 대신 다른 대체 재료를 제시해줘.\n" +
                        "예를 들어, \"소고기 대신 돼지고기를 사용할 수 없습니다. 대신 다른 재료를 추천합니다.\"처럼 간결하게만 작성해줘."
                ,
                userInput, recipeTitle, String.join(", ", recipeIngredients), avoidedIngredients
        );


        //GPT에게 프롬프트 전송 및 결과 받기
        String gptResponse = gptService.callGptApi(prompt, 200, 0.7);

        // GPT 응답에서 대체 재료 목록과 메시지, intent 포함한 결과 파싱
        Map<String, Object> result = parseAlternativeIngredients(gptResponse);

        // 대체 재료 목록 반환
        return result;

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

    //GPT 응답에서 대체 재료 목록 파싱
    private Map<String, Object> parseAlternativeIngredients(String gptResponse) {
        try {
            // 불필요한 마크다운 부분을 제거하고 JSON만 추출
            String jsonResponse = gptResponse.replaceAll("(?s)^.*```json\\s*\\n", "");  // '```json' 이후의 공백 제거
            jsonResponse = jsonResponse.replaceAll("\\n```.*$", "");  // '```' 이전의 모든 부분 제거
            jsonResponse = jsonResponse.replaceAll("^(###|\\*\\*|\\*|\\n)+", "");

            // JSON 형식으로 응답을 파싱
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Object> responseMap = objectMapper.readValue(jsonResponse, Map.class);

            // 대체 재료 목록 추출
            List<String> alternativeIngredients = (List<String>) responseMap.get("alternative_ingredients");
            // 긍정/부정 메시지 출력
            String message = (String) responseMap.get("message");

            // 결과에 메시지와 대체 재료 목록 추가
            Map<String, Object> result = new HashMap<>();
            result.put("alternativeIngredients", alternativeIngredients != null ? alternativeIngredients : new ArrayList<>());
            result.put("message", message != null ? message : "알 수 없음");

            return result;
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorResult = new HashMap<>();
            errorResult.put("message", "error");
            return errorResult;
        }
    }

}
