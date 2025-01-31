package com.ssafy.foodthink.global;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Service
public class S3Service {

    private final S3Client s3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    @Autowired
    public S3Service(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    // MultipartFile을 받아 S3에 업로드하고, 업로드된 파일의 URL을 반환
    public String uploadFile(MultipartFile file) {
        String fileName = generateFileName(file);
        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .acl("public-read") // 파일을 공개적으로 읽을 수 있도록 설정
                    .contentType(file.getContentType()) // 업로드하는 파일의 실제 MIME 타입을 설정
                    .contentDisposition("inline") // 브라우저에서 파일을 직접 표시
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            return String.format("https://%s.s3.amazonaws.com/%s", bucketName, fileName);
        } catch (IOException e) {
            throw new RuntimeException("파일 업로드에 실패했습니다", e);
        }
    }

    // 파일 이름 생성
    private String generateFileName(MultipartFile file) {
        return UUID.randomUUID().toString() + "-" + file.getOriginalFilename();
    }
}
