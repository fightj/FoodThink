package com.ssafy.foodthink.speech.service;

import com.google.auth.oauth2.GoogleCredentials;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import com.google.cloud.dialogflow.v2.*;
import com.google.protobuf.Struct;
import com.google.protobuf.Value;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

/*
    whisper API에서 만든 텍스트에서 자연어 처리
    dialogflow API 사용
 */

@Service
public class DialogflowService {

    //키 주의해야 함!!!!!!!!!!!!!!!!!!!!!
    String projectId = System.getenv("dialogflow.project-id");

    public String detectIntentText(String text) {
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

            System.out.println("디버깅: queryResult.getQueryText() = " + queryResult.getQueryText());  // 응답에서 받은 queryText
            System.out.println("디버깅: queryResult.getFulfillmentText() = " + queryResult.getFulfillmentText());  // 응답에서 받은 fulfillmentText

            //Intent 감지
            String intentName = "";
            if(queryResult.hasIntent()) {
                intentName = queryResult.getIntent().getDisplayName();  //감지된 Intent
            } else {
                intentName = "Intent 없음";
            }

            System.out.println("🎯 감지된 Intent: " + intentName);

            //파라미터 확인
            Struct parameters = queryResult.getParameters(); // 파라미터 값 추출
            System.out.println("파라미터 : " + parameters);

            // "READ_STEP" Intent 처리
            if ("현재단계읽기".equals(intentName)) {
                // 파라미터에서 "number" 값을 추출하고, 기본값 설정
                int stepNumber = (int) parameters.getFieldsMap()
                        .getOrDefault("number", Value.newBuilder().setNumberValue(1).build())
                        .getNumberValue();
                return "📖 " + stepNumber + "단계: 요리 과정 설명";
            }

            //의도 처리 후 텍스트 반환
            return queryResult.getFulfillmentText();
        } catch (IOException e) {
            e.printStackTrace();
            return "❌ Dialogflow API 호출 중 오류 발생!";
        }
    }

}
