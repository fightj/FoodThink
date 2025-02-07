package com.ssafy.foodthink.speech.controller;

import com.ssafy.foodthink.speech.service.WhisperService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@RestController
@RequestMapping("/api/speech")
public class SpeechController {

    private final WhisperService whisperService;

    public SpeechController(WhisperService whisperService) {
        this.whisperService = whisperService;
    }

    // 📝 녹음된 파일을 Whisper API로 전송하여 텍스트 변환
    @PostMapping("/transcribe")
    public ResponseEntity<String> transcribeAudio(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("❌ 파일이 비어 있습니다!");
        }

        try {
            // 업로드된 파일을 임시 저장
            File tempFile = File.createTempFile("uploaded_", ".wav");
            file.transferTo(tempFile);

            // Whisper API로 전송
            String transcript = whisperService.transcribeAudio(tempFile);

            // 임시 파일 삭제
            tempFile.delete();

            return ResponseEntity.ok(transcript);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("❌ 오류 발생!");
        }
    }

}
