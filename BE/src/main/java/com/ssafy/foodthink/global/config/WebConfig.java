package com.ssafy.foodthink.global.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 모든 경로("/**")에 대해 CORS 설정을 적용
                .allowedOrigins("http://localhost:5173", "http://localhost:5174") // 프론트엔드 주소에서의 요청을 허용
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*") // 모든 헤더를 허용
                .exposedHeaders("Authorization", "Set-Cookie") // "Authorization"과 "Set-Cookie" 헤더를 클라이언트에 노출
                .allowCredentials(true) // 자격 증명(쿠키, HTTP 인증)을 허용
                .maxAge(3600); // 프리플라이트 요청의 결과를 1시간(3600초) 동안 캐시
    }
}
