package com.ssafy.foodthink.speech.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.entity.EntityBuilder;
import org.apache.hc.client5.http.entity.mime.MultipartEntityBuilder;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.CloseableHttpResponse;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;

/*
    .wav 음성 파일을 텍스트로 추출
    Whisper API 사용
 */

@Service
public class WhisperService {

    @Value("${openai.api.key}")
    private String apiKey;

    private static final String WHISPER_API_URL = "https://api.openai.com/v1/audio/transcriptions";

    public String transcribeAudio(File audioFile) {
        if(!audioFile.exists() || audioFile.length() == 0) {
            return "변환할 오디오 파일이 없습니다.";
        }

        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpPost request = new HttpPost(WHISPER_API_URL);
            request.addHeader("Authorization", "Bearer " + apiKey);
//            request.addHeader("Content-Type", "multipart/form-data");

            MultipartEntityBuilder entityBuilder = MultipartEntityBuilder.create();
            entityBuilder.addBinaryBody("file", audioFile); // 파일 추가
            entityBuilder.addTextBody("model", "whisper-1");  // 텍스트 추가

            request.setEntity(entityBuilder.build());

            System.out.println("📤 Whisper API 요청 전송... 파일 크기: " + audioFile.length() + " bytes");

            try (CloseableHttpResponse response = httpClient.execute(request)) {
                String jsonResponse = new String(response.getEntity().getContent().readAllBytes());

                System.out.println("whisper api 응답 : " + jsonResponse);

                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode jsonNode = objectMapper.readTree(jsonResponse);

                //예외 방지 : text 필드가 존재하는가?
                if(jsonNode.has("text")) {
                    return jsonNode.get("text").asText();
                } else {
                    return "whisper 응답에 'text' 필드가 없습니다.";
                }

            }
        } catch (IOException e) {
            e.printStackTrace();
            return "오류 발생!";
        }
    }

}
