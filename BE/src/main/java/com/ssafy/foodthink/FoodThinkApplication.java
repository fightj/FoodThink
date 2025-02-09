package com.ssafy.foodthink;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.data.elasticsearch.ReactiveElasticsearchRepositoriesAutoConfiguration;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication(exclude = ReactiveElasticsearchRepositoriesAutoConfiguration.class)
@EnableJpaAuditing // 엔티티의 생성일자, 수정일자, 생성자, 수정자 등 자동 관리
@EnableElasticsearchRepositories(basePackages = "com.ssafy.foodthink.elasticsearch.elasticsearchrepository")
@ComponentScan(basePackages = "com.ssafy.foodthink")
public class FoodThinkApplication {

	public static void main(String[] args) {
		SpringApplication.run(FoodThinkApplication.class, args);
	}

}
