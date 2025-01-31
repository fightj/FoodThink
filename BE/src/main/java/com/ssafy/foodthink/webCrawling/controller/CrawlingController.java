package com.ssafy.foodthink.webCrawling.controller;

import com.ssafy.foodthink.webCrawling.service.CrawlingService;
import com.ssafy.foodthink.webCrawling.service.CrawlingServiceDemo;
import com.ssafy.foodthink.webCrawling.service.CrawlingServiceWebClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;

/*
    크롤링 요청 처리
 */

@RestController
public class CrawlingController {

    @Autowired
    private CrawlingService crawlingService;

    @Autowired
    private CrawlingServiceDemo crawlingServiceDemo;

    @Autowired
    private CrawlingServiceWebClient crawlingServiceWebClient;

    //크롤링 시작 API
    @GetMapping("/web-crawling/crawling")
    public String crawlRecipes() {
        crawlingService.crawlRecipes();
        return "Crawling completed!";
    }

    @GetMapping("/web-crawling/crawling2")
    public String crawlRecipes2() {
        crawlingServiceDemo.startCrawling();
        return "Crawling completed!";
    }

    // 수동 호출을 위한 API 엔드포인트
    @GetMapping("/startCrawling")
    public String startCrawlingManually() {
        crawlingServiceDemo.startCrawling();  // startCrawling() 수동 호출
        return "Crawling started!";
    }

    @GetMapping("/startWebClient")
    public String startCrawlingWebclient() {
        crawlingServiceWebClient.startCrawling();
        return "Crawling started!!!";
    }

}
