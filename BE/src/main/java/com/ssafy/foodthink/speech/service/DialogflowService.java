package com.ssafy.foodthink.speech.service;

import com.google.auth.oauth2.GoogleCredentials;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import com.google.cloud.dialogflow.v2.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/*
    whisper API에서 만든 텍스트에서 자연어 처리
    dialogflow API 사용
 */

@Service
public class DialogflowService {

    @org.springframework.beans.factory.annotation.Value("${dialogflow.project-id}")
    private String projectId;

    private final AlternativeIngredientRecommend1Service alternativeIngredientRecommend1Service;    //대체재료 추천1
    private final AlternativeIngredientRecommend2Service alternativeIngredientRecommend2Service;    //대체재료 추천2

    public DialogflowService(AlternativeIngredientRecommend1Service alternativeIngredientRecommend1Service,
                             AlternativeIngredientRecommend2Service alternativeIngredientRecommend2Service) {
        this.alternativeIngredientRecommend1Service = alternativeIngredientRecommend1Service;
        this.alternativeIngredientRecommend2Service = alternativeIngredientRecommend2Service;
    }

    public Map<String, Object> detectIntentText(String text, String token, Long recipeId) {
        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("data", new HashMap<>());

        try (//세션 클라이언트 생성
             SessionsClient sessionsClient = SessionsClient.create(
                     SessionsSettings.newBuilder()
                             .setCredentialsProvider(() ->
                                     GoogleCredentials.fromStream(
                                             new ClassPathResource("dialogflow-key.json").getInputStream()
                                     )
                             ).build())) {

            String sessionId = "test-session";
            SessionName session = SessionName.of(projectId, sessionId);

            // 텍스트 요청 생성
            TextInput.Builder textInput = TextInput.newBuilder().setText(text).setLanguageCode("en");
            QueryInput queryInput = QueryInput.newBuilder().setText(textInput).build();

            // Dialogflow API 호출
            DetectIntentResponse response = sessionsClient.detectIntent(session, queryInput);
            QueryResult queryResult = response.getQueryResult();

            //Intent 감지 및 confidence 확인
            String intentName = queryResult.hasIntent() ? queryResult.getIntent().getDisplayName() : "";
            float confidence = queryResult.getIntentDetectionConfidence();

            System.out.println("감지된 intent : " + intentName);
            System.out.println("confidence score : " + confidence);

            responseMap.put("intent", intentName);

            if("대체재료추천1".equals(intentName)) {
                //OO 대신 다른 재료 추천해줘.
                List<String> alternativeIngredients = alternativeIngredientRecommend1Service.recommendAlternativeIngredients(token, recipeId, text);
                responseMap.put("data", Map.of("alternativeIngredients", alternativeIngredients));
            } else if("대체재료추천2".equals(intentName)) {
                //OO대신 XX 어때?
                // 대체 재료 추천 처리
                Map<String, Object> alternativeIngredients = alternativeIngredientRecommend2Service.recommendAlternativeIngredients(token, recipeId, text);
                responseMap.put("data", alternativeIngredients);
            } else if ("타이머설정".equals(intentName)) {
                int minutes = 0, seconds = 0;
                if (text != null && !text.isEmpty()) {
                    //정규식 패턴: "XX분YY초" 또는 "XX분" 또는 "YY초"
                    Pattern pattern = Pattern.compile("(\\d+)\\s*분(?:\\s*(\\d+)\\s*초)?|(\\d+)\\s*초");
                    Matcher matcher = pattern.matcher(text.replaceAll("\\s+", "")); // 띄어쓰기 제거

                    if (matcher.find()) {
                        if (matcher.group(1) != null && !matcher.group(1).isEmpty()) {
                            minutes = Integer.parseInt(matcher.group(1));
                        }
                        if (matcher.group(2) != null && !matcher.group(2).isEmpty()) {
                            seconds = Integer.parseInt(matcher.group(2));
                        }
                        if (matcher.group(3) != null && !matcher.group(3).isEmpty()) {
                            seconds = Integer.parseInt(matcher.group(3));
                        }
                    }
                }

                responseMap.put("data", Map.of("minutes", minutes, "seconds", seconds));
            } else if(List.of("현대단계읽기", "다음단계넘어가기", "이전단계돌아가기", "타이머중지", "종료하기", "재료닫기", "재료보기").contains(intentName)) {
                responseMap.put("data", Map.of());
            } else {
                //정확도가 낮거나 intent가 비어있을 때 재시도 요청 반환
                if(confidence < 0.6 || intentName.isEmpty()) {
                    responseMap.put("data", Map.of("message", "죄송합니다, 다시 한 번 말하거나 다른 방식을 시도해주세요."));
                }
            }

        } catch (IOException e) {
            e.printStackTrace();
            responseMap.put("message", "Dialogflow API 호출 중 오류 발생");
        }

//        try {
//            //세션 클라이언트 생성
//            SessionsClient sessionsClient = SessionsClient.create(
//                    SessionsSettings.newBuilder()
//                            .setCredentialsProvider(() ->
//                                    GoogleCredentials.fromStream(
//                                            new ClassPathResource("dialogflow-key.json").getInputStream()
//                                    )
//                            ).build()
//            );
//
//            String sessionId = "test-session";
//            SessionName session = SessionName.of(projectId, sessionId);
//
//            // 텍스트 요청 생성
//            TextInput.Builder textInput = TextInput.newBuilder().setText(text).setLanguageCode("en");
//            QueryInput queryInput = QueryInput.newBuilder().setText(textInput).build();
//
//            // Dialogflow API 호출
//            DetectIntentResponse response = sessionsClient.detectIntent(session, queryInput);
//            QueryResult queryResult = response.getQueryResult();
//
//            //Intent 감지 및 confidence 확인
//            String intentName = queryResult.hasIntent() ? queryResult.getIntent().getDisplayName() : "";
//            float confidence = queryResult.getIntentDetectionConfidence();
//
//            System.out.println("감지된 intent : " + intentName);
//            System.out.println("confidence score : " + confidence);
//
//            responseMap.put("intent", intentName);
//
//            if("대체재료추천1".equals(intentName)) {
//                //OO 대신 다른 재료 추천해줘.
//                List<String> alternativeIngredients = alternativeIngredientRecommend1Service.recommendAlternativeIngredients(token, recipeId, text);
//                responseMap.put("data", Map.of("alternativeIngredients", alternativeIngredients));
//            } else if("대체재료추천2".equals(intentName)) {
//                //OO대신 XX 어때?
//                // 대체 재료 추천 처리
//                Map<String, Object> alternativeIngredients = alternativeIngredientRecommend2Service.recommendAlternativeIngredients(token, recipeId, text);
//                responseMap.put("data", alternativeIngredients);
//            } else if ("타이머설정".equals(intentName)) {
//                int minutes = 0, seconds = 0;
//                if (text != null && !text.isEmpty()) {
//                    //정규식 패턴: "XX분YY초" 또는 "XX분" 또는 "YY초"
//                    Pattern pattern = Pattern.compile("(\\d+)\\s*분(?:\\s*(\\d+)\\s*초)?|(\\d+)\\s*초");
//                    Matcher matcher = pattern.matcher(text.replaceAll("\\s+", "")); // 띄어쓰기 제거
//
//                    if (matcher.find()) {
//                        if (matcher.group(1) != null && !matcher.group(1).isEmpty()) {
//                            minutes = Integer.parseInt(matcher.group(1));
//                        }
//                        if (matcher.group(2) != null && !matcher.group(2).isEmpty()) {
//                            seconds = Integer.parseInt(matcher.group(2));
//                        }
//                        if (matcher.group(3) != null && !matcher.group(3).isEmpty()) {
//                            seconds = Integer.parseInt(matcher.group(3));
//                        }
//                    }
//                }
//
//                responseMap.put("data", Map.of("minutes", minutes, "seconds", seconds));
//            } else if(List.of("현대단계읽기", "다음단계넘어가기", "이전단계돌아가기", "타이머중지", "종료하기").contains(intentName)) {
//                responseMap.put("data", Map.of());
//            } else {
//                //정확도가 낮거나 intent가 비어있을 때 재시도 요청 반환
//                if(confidence < 0.6 || intentName.isEmpty()) {
//                    responseMap.put("data", Map.of("message", "죄송합니다, 다시 한 번 말하거나 다른 방식을 시도해주세요."));
//                }
//            }
//
//        } catch (IOException e) {
//            e.printStackTrace();
//            responseMap.put("message", "Dialogflow API 호출 중 오류 발생");
//        }

        return responseMap;
    }

}
