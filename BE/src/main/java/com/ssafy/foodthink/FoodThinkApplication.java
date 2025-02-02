package com.ssafy.foodthink;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

//@EnableScheduling
@SpringBootApplication
@EnableJpaAuditing
@ComponentScan(basePackages = "com.ssafy.foodthink")
public class FoodThinkApplication {

	public static void main(String[] args) {
		SpringApplication.run(FoodThinkApplication.class, args);
	}

}
