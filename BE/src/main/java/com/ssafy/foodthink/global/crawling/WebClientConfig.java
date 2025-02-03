package com.ssafy.foodthink.global.crawling;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean
    public WebClient webClient(WebClient.Builder builder) {
        return builder.baseUrl("https://www.10000recipe.com/recipe/list.html").build(); // 기본 URL 설정
    }
}
