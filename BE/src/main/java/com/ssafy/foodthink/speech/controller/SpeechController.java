package com.ssafy.foodthink.speech.controller;

import com.ssafy.foodthink.speech.service.WhisperService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/speech")
public class SpeechController {

    private final WhisperService whisperService;

    public SpeechController(WhisperService whisperService) {
        this.whisperService = whisperService;
    }

    //음성 반환
    @PostMapping("/process")
    public ResponseEntity<?> processSpeech(
            @RequestHeader(value = "Authorization", required = false) String token,
            @RequestParam("file") MultipartFile file,
            @RequestParam("recipeId") Long recipeId) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "파일이 비어 있습니다!"));
        }

        try {
            // 업로드된 파일을 임시 저장
            File tempFile = File.createTempFile("uploaded_", ".wav");
            file.transferTo(tempFile);

            // Whisper API로 전송
            Map<String, Object> transcript = whisperService.processAudio(tempFile, token, recipeId);

            if (transcript == null || transcript.isEmpty()) {
                return ResponseEntity.status(500)
                        .body(Map.of("message", "텍스트 변환 실패! Whisper API에서 반환된 텍스트가 비어있습니다."));
            }

            // 임시 파일 삭제
            tempFile.delete();

            return ResponseEntity.ok(transcript);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "파일 처리 중 오류 발생!"));
        }
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "오류 발생! : " + e.getMessage()));
        }
    }

}
