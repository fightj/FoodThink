//package com.ssafy.foodthink.webCrawling.cleanup;
//
//import com.ssafy.foodthink.webCrawling.service.CrawlingService;
//import jakarta.annotation.PostConstruct;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Component;
//
//@Component
//public class CrawlingCleanupScheduler {
//
//    @Autowired
//    private CrawlingService crawlingService;
//
//    @PostConstruct
//    public void cleanUpAfterCrawling() {
//        crawlingService.deleteRecipesWithoutIngredients();
//    }
//}
