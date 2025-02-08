package com.ssafy.foodthink.speech.service;

import com.google.auth.oauth2.GoogleCredentials;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import com.google.cloud.dialogflow.v2.*;
import com.google.protobuf.Struct;
import com.google.protobuf.Value;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/*
    whisper API에서 만든 텍스트에서 자연어 처리
    dialogflow API 사용
 */

@Service
public class DialogflowService {

    @org.springframework.beans.factory.annotation.Value("${dialogflow.project-id}")
    private String projectId;

    public Map<String, Object> detectIntentText(String text) {
        Map<String, Object> responseMap = new HashMap<>();

        try {
            //세션 클라이언트 생성
            SessionsClient sessionsClient = SessionsClient.create(
                    SessionsSettings.newBuilder()
                            .setCredentialsProvider(() ->
                                    GoogleCredentials.fromStream(
                                            new ClassPathResource("dialogflow-key.json").getInputStream()
                                    )
                            ).build()
            );

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

            //정확도가 낮거나 intent가 비어있을 때 재시도 요청 반환
            if(confidence < 0.8 || intentName.isEmpty()) {
                responseMap.put("message", "죄송합니다, 다시 한 번 말해주세요.");
                responseMap.put("inetent", "");
                return responseMap;
            }

            responseMap.put("intent", intentName);

            //파라미터 확인
//            Struct parameters = queryResult.getParameters(); // 파라미터 값 추출
//            System.out.println("파라미터 : " + parameters);

            //현재단계읽기
//            if ("현재단계읽기".equals(intentName)) {
//                // 파라미터에서 "number" 값을 추출하고, 기본값 설정
//                Struct parameters = queryResult.getParameters();
//                int stepNumber = (int) parameters.getFieldsMap()
//                        .getOrDefault("number", Value.newBuilder().setNumberValue(1).build())
//                        .getNumberValue();
//                responseMap.put("stepNumber", stepNumber != -1 ? stepNumber : null);
//            }
        } catch (IOException e) {
            e.printStackTrace();
            responseMap.put("message", "Dialogflow API 호출 중 오류 발생");
        }

        return responseMap;
    }

}
