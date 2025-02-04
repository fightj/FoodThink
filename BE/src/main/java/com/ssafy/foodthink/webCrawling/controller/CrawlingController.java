package com.ssafy.foodthink.webCrawling.controller;

import com.ssafy.foodthink.webCrawling.service.CrawlingService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;

/*
    크롤링 요청 처리
 */

@RestController
public class CrawlingController {

    @Autowired
    private CrawlingService crawlingService;

    //크롤링 시작 API
    @GetMapping("/web-crawling/crawling")
    public String crawlRecipes() {
        crawlingService.crawlRecipes();
        return "Crawling completed!";
    }

}
