package com.ssafy.foodthink.speech.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.entity.mime.MultipartEntityBuilder;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.CloseableHttpResponse;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;

/*
    .wav 음성 파일을 텍스트로 변환 후, 바로 Dialogflow API로 전달하여 처리
 */

@Service
public class WhisperService {

    @Value("${gpt.api.key}")
    private String apiKey;

    private final DialogflowService dialogflowService;  // Dialogflow 연계

    public WhisperService(DialogflowService dialogflowService) {
        this.dialogflowService = dialogflowService;
    }

    private static final String WHISPER_API_URL = "https://api.openai.com/v1/audio/transcriptions";

    public String processAudio(File audioFile) {
        if (!audioFile.exists() || audioFile.length() == 0) {
            return "❌ 변환할 오디오 파일이 없습니다.";
        }

        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpPost request = new HttpPost(WHISPER_API_URL);
            request.addHeader("Authorization", "Bearer " + apiKey);

            MultipartEntityBuilder entityBuilder = MultipartEntityBuilder.create();
            entityBuilder.addBinaryBody("file", audioFile); // 파일 추가
            entityBuilder.addTextBody("model", "whisper-1");  // 모델 설정

            request.setEntity(entityBuilder.build());

            System.out.println("📤 Whisper API 요청 전송... 파일 크기: " + audioFile.length() + " bytes");

            try (CloseableHttpResponse response = httpClient.execute(request)) {
                String jsonResponse = new String(response.getEntity().getContent().readAllBytes());

                System.out.println("Whisper API 응답: " + jsonResponse);

                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode jsonNode = objectMapper.readTree(jsonResponse);

                if (jsonNode.has("text") && jsonNode.get("text").asText() != null) {
                    String transcript = jsonNode.get("text").asText();
                    System.out.println("📝 변환된 텍스트: " + transcript);

                    // 변환된 텍스트를 Dialogflow로 보내기
                    String dialogflowResponse = dialogflowService.detectIntentText(transcript);
                    return "🎯 최종 응답: " + dialogflowResponse;
                } else {
                    return "❌ Whisper 응답에 'text' 필드가 없습니다.";
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
            return "❌ 오류 발생!";
        }
    }
}
