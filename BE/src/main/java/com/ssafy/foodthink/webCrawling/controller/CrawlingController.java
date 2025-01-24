package com.ssafy.foodthink.webCrawling.controller;

import com.ssafy.foodthink.webCrawling.service.CrawlingService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@RestController
public class CrawlingController {

    @Autowired
    private CrawlingService crawlingService;

    // API 정리 및 다시 하기 -> 크롤링 시작임
    
    @GetMapping("/crawl")
    public String crawlRecipes() {
        crawlingService.crawlRecipes();
        return "Crawling completed!";
    }

}
