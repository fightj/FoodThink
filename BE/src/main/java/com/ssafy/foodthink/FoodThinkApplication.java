package com.ssafy.foodthink;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

//@EnableScheduling
@SpringBootApplication
@EnableJpaAuditing // 엔티티의 생성일자, 수정일자, 생성자, 수정자 등 자동 관리
@ComponentScan(basePackages = "com.ssafy.foodthink")
public class FoodThinkApplication {

	public static void main(String[] args) {
		SpringApplication.run(FoodThinkApplication.class, args);
	}

}
