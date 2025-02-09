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
            if(confidence < 0.6 || intentName.isEmpty()) {
                responseMap.put("message", "죄송합니다, 다시 한 번 말해주세요.");
                responseMap.put("inetent", "");
                return responseMap;
            }

            responseMap.put("intent", intentName);

            //intent 처리
            if ("타이머설정".equals(intentName)) {
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

                //응답 추가
                responseMap.put("minutes", minutes);
                responseMap.put("seconds", seconds);
            }

        } catch (IOException e) {
            e.printStackTrace();
            responseMap.put("message", "Dialogflow API 호출 중 오류 발생");
        }

        return responseMap;
    }

}
